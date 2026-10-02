import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { Client, Invoice, Project } from '@/lib/models'
import { invoicePatch } from '@/lib/schemas'
import { serializeInvoice } from '@/lib/delivery'
import { totals } from '@/lib/workflow'

type Ctx = { params: Promise<{ id: string }> }

async function load(id: string) {
  const inv = await Invoice.findById(oid(id))
  if (!inv) throw new ApiError(404, 'Invoice not found.')
  return inv
}

/** Invoice with company and client details, for the printable view. */
export const GET = route<Ctx>(async (req, { params }) => {
  await requireUser(req, ['owner', 'manager'])
  const inv = await load((await params).id)
  const [project, client] = await Promise.all([Project.findById(inv.project, { name: 1 }).lean(), inv.client ? Client.findById(inv.client).lean() : null])
  return NextResponse.json({
    invoice: serializeInvoice(inv.toObject()),
    project: { name: project?.name ?? '' },
    client: client ? { name: client.name, contactPerson: client.contactPerson, email: client.email, phone: client.phone, billingAddress: client.billingAddress, gstin: client.gstin } : null,
    company: {
      name: process.env.COMPANY_NAME || 'TechRover',
      address: process.env.COMPANY_ADDRESS || '',
      gstin: process.env.COMPANY_GSTIN || '',
      email: process.env.COMPANY_EMAIL || '',
      bank: process.env.COMPANY_BANK_DETAILS || '',
    },
  })
})

const actionSchema = z.object({ action: z.enum(['send', 'paid', 'cancel', 'reopen']).optional(), paymentRef: z.string().max(200).optional(), paidAt: z.string().date().optional() })

export const PATCH = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const inv = await load((await params).id)
  const raw = await req.json().catch(() => ({}))
  const act = actionSchema.parse(raw)

  if (act.action) {
    if (act.action === 'send') {
      if (inv.status !== 'draft') throw new ApiError(400, 'Only a draft can be sent.')
      inv.status = 'sent'
      inv.issueDate = new Date()
    } else if (act.action === 'paid') {
      if (inv.status === 'cancelled') throw new ApiError(400, 'This invoice is cancelled.')
      inv.status = 'paid'
      inv.paidAt = act.paidAt ? new Date(`${act.paidAt}T12:00:00+05:30`) : new Date()
      inv.paymentRef = act.paymentRef ?? inv.paymentRef
    } else if (act.action === 'cancel') {
      if (inv.status === 'paid') throw new ApiError(400, 'A paid invoice cannot be cancelled.')
      inv.status = 'cancelled'
    } else if (act.action === 'reopen') {
      if (inv.status !== 'cancelled') throw new ApiError(400, 'Only a cancelled invoice can be reopened.')
      inv.status = 'draft'
    }
    await inv.save()
    await logActivity(me, `invoice.${act.action}`, 'Invoice', inv._id, `${me.name} marked invoice ${inv.number} ${inv.status}`, inv.project)
    return NextResponse.json({ invoice: serializeInvoice(inv.toObject()) })
  }

  if (inv.status !== 'draft') throw new ApiError(400, 'Only draft invoices can be edited. Cancel and create a new one.')
  const input = invoicePatch.parse(raw)
  if (input.items) inv.set('items', input.items)
  if (input.gstPercent !== undefined) inv.gstPercent = input.gstPercent
  if (input.notes !== undefined) inv.notes = input.notes
  if (input.dueDate !== undefined) inv.set('dueDate', input.dueDate ? new Date(`${input.dueDate}T23:59:59+05:30`) : undefined)
  if (input.milestone !== undefined) inv.set('milestone', input.milestone || undefined)
  const t = totals(inv.items, inv.gstPercent)
  inv.subtotal = t.subtotal
  inv.gstAmount = t.gstAmount
  inv.total = t.total
  await inv.save()
  return NextResponse.json({ invoice: serializeInvoice(inv.toObject()) })
})

export const DELETE = route<Ctx>(async (req, { params }) => {
  await requireUser(req, ['owner', 'manager'])
  const inv = await load((await params).id)
  if (inv.status !== 'draft') throw new ApiError(400, 'Only drafts can be deleted. Cancel a sent invoice instead.')
  await inv.deleteOne()
  return NextResponse.json({ ok: true })
})
