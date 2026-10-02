import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Invoice, Project } from '@/lib/models'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { managerIds, notify } from '@/lib/workflow'

/** Razorpay webhook (event: payment_link.paid) → marks the invoice paid. Set RAZORPAY_WEBHOOK_SECRET. */
export async function POST(req: NextRequest) {
  const body = await req.text()
  if (!verifyRazorpaySignature(body, req.headers.get('x-razorpay-signature'))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  const event = JSON.parse(body)
  if (event.event !== 'payment_link.paid') return NextResponse.json({ ignored: true })
  await connectDB()
  const linkId = event.payload?.payment_link?.entity?.id
  const paymentId = event.payload?.payment?.entity?.id
  const inv = linkId ? await Invoice.findOne({ razorpayLinkId: linkId }) : null
  if (!inv) return NextResponse.json({ ignored: true })
  if (inv.status !== 'paid') {
    inv.status = 'paid'
    inv.paidAt = new Date()
    inv.paymentRef = paymentId ? `Razorpay ${paymentId}` : 'Razorpay'
    await inv.save()
    const project = await Project.findById(inv.project, { name: 1 }).lean()
    await notify(await managerIds(), { title: `Payment received: ${inv.number} ₹${inv.total.toLocaleString('en-IN')}`, body: project?.name ?? '', tab: 'invoices' }, { email: true })
  }
  return NextResponse.json({ ok: true })
}
