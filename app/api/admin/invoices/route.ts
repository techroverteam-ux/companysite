import { NextResponse } from 'next/server'
import { ApiError, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { Client, INVOICE_STATUSES, Invoice, Milestone, Project } from '@/lib/models'
import { invoiceInput } from '@/lib/schemas'
import { serializeInvoice } from '@/lib/delivery'
import { nextSeq, pad, totals } from '@/lib/workflow'

export const GET = route(async (req) => {
  await requireUser(req, ['owner', 'manager'])
  const sp = req.nextUrl.searchParams
  const filter: Record<string, unknown> = {}
  if (sp.get('project')) filter.project = oid(sp.get('project'), 'project')
  const status = sp.get('status')
  if (status && (INVOICE_STATUSES as readonly string[]).includes(status)) filter.status = status
  const list = await Invoice.find(filter).sort({ createdAt: -1 }).limit(1000).lean()
  const [projects, clients] = await Promise.all([
    Project.find({ _id: { $in: list.map((i) => i.project) } }, { name: 1 }).lean(),
    Client.find({ _id: { $in: list.map((i) => i.client).filter(Boolean) } }, { name: 1 }).lean(),
  ])
  const pn = new Map(projects.map((p) => [String(p._id), p.name]))
  const cn = new Map(clients.map((c) => [String(c._id), c.name]))
  const now = new Date()
  return NextResponse.json({
    invoices: list.map((i) => ({
      ...serializeInvoice(i),
      projectName: pn.get(String(i.project)) ?? '',
      clientName: i.client ? cn.get(String(i.client)) ?? '' : '',
      overdue: i.status === 'sent' && !!i.dueDate && i.dueDate < now,
    })),
  })
})

/** New invoice. With a milestone and no items, the line is "<milestone> (x% of contract value)". */
export const POST = route(async (req) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const input = await parseBody(req, invoiceInput)
  const project = await Project.findById(input.project).lean()
  if (!project) throw new ApiError(404, 'Project not found.')
  let items = input.items
  if (input.milestone) {
    const m = await Milestone.findOne({ _id: input.milestone, project: project._id }).lean()
    if (!m) throw new ApiError(400, 'That milestone is not on this project.')
    if (!items.length) {
      const amount = Math.round(((project.value ?? 0) * (m.percent ?? 0)) / 100)
      if (!amount) throw new ApiError(400, 'Set the project value and milestone % first, or add line items.')
      items = [{ description: `${project.name} — ${m.title} (${m.percent}%)`, quantity: 1, rate: amount }]
    }
  }
  if (!items.length) throw new ApiError(400, 'Add at least one line item.')
  const t = totals(items, input.gstPercent)
  const inv = await Invoice.create({
    number: `TR-INV-${pad(await nextSeq('invoice'))}`,
    project: project._id,
    client: project.clientRef,
    milestone: input.milestone || undefined,
    items,
    gstPercent: input.gstPercent,
    subtotal: t.subtotal,
    gstAmount: t.gstAmount,
    total: t.total,
    dueDate: input.dueDate ? new Date(`${input.dueDate}T23:59:59+05:30`) : new Date(Date.now() + 7 * 864e5),
    notes: input.notes,
    createdBy: me._id,
  })
  await logActivity(me, 'invoice.created', 'Invoice', inv._id, `${me.name} drafted invoice ${inv.number} (₹${t.total.toLocaleString('en-IN')})`, project._id)
  return NextResponse.json({ invoice: serializeInvoice(inv.toObject()) }, { status: 201 })
})
