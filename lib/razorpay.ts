import { createHmac, timingSafeEqual } from 'crypto'

export const razorpayEnabled = () => !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)

/** Creates a Razorpay Payment Link for an invoice. https://razorpay.com/docs/api/payments/payment-links/ */
export async function createPaymentLink(opts: { amountInr: number; reference: string; description: string; customer: { name?: string; email?: string; contact?: string }; callbackUrl?: string }) {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')
  const res = await fetch('https://api.razorpay.com/v1/payment_links', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: Math.round(opts.amountInr * 100),
      currency: 'INR',
      reference_id: opts.reference,
      description: opts.description.slice(0, 2048),
      customer: Object.fromEntries(Object.entries(opts.customer).filter(([, v]) => v)),
      notify: { sms: !!opts.customer.contact, email: !!opts.customer.email },
      reminder_enable: true,
      ...(opts.callbackUrl ? { callback_url: opts.callbackUrl, callback_method: 'get' } : {}),
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error?.description || `Razorpay error ${res.status}`)
  return { id: data.id as string, url: data.short_url as string }
}

export function verifyRazorpaySignature(body: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret || !signature) return false
  const expected = createHmac('sha256', secret).update(body).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}
