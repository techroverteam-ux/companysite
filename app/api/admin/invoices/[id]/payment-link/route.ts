import { NextResponse } from 'next/server'
import { ApiError, logActivity, oid, requireUser, route } from '@/lib/api'
import { Client, Invoice } from '@/lib/models'
import { createPaymentLink, razorpayEnabled } from '@/lib/razorpay'
import { serializeInvoice } from '@/lib/delivery'

type Ctx = { params: Promise<{ id: string }> }

/** Create a Razorpay payment link for the invoice (needs RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET). */
export const POST = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  if (!razorpayEnabled()) throw new ApiError(400, 'Razorpay is not set up. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the environment, or mark the invoice paid manually.')
  const inv = await Invoice.findById(oid((await params).id))
  if (!inv) throw new ApiError(404, 'Invoice not found.')
  if (inv.status === 'paid' || inv.status === 'cancelled') throw new ApiError(400, `This invoice is ${inv.status}.`)
  const client = inv.client ? await Client.findById(inv.client).lean() : null
  try {
    const link = await createPaymentLink({
      amountInr: inv.total,
      reference: inv.number ?? String(inv._id),
      description: `${inv.number} · ${inv.items.map((i) => i.description).join(', ')}`,
      customer: { name: client?.contactPerson || client?.name, email: client?.email, contact: client?.phone },
    })
    inv.paymentLink = link.url
    inv.razorpayLinkId = link.id
    if (inv.status === 'draft') {
      inv.status = 'sent'
      inv.issueDate = new Date()
    }
    await inv.save()
  } catch (err: any) {
    throw new ApiError(502, `Razorpay: ${err.message}`)
  }
  await logActivity(me, 'invoice.payment_link', 'Invoice', inv._id, `${me.name} created a payment link for ${inv.number}`, inv.project)
  return NextResponse.json({ invoice: serializeInvoice(inv.toObject()) })
})
