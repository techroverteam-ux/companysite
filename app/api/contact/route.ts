import { NextResponse } from 'next/server'
import { clientIp, parseBody, rateLimit, route } from '@/lib/api'
import { contactLead } from '@/lib/leads'
import { Lead } from '@/lib/models'

export const POST = route(async (req) => {
  const ip = clientIp(req)
  rateLimit(`lead:${ip}`, 5, 60_000)
  const data = await parseBody(req, contactLead)
  if (data.website) return NextResponse.json({ success: true }) // bot

  await Lead.create({
    type: 'contact',
    name: [data.firstName, data.lastName].filter(Boolean).join(' '),
    email: data.email,
    company: data.company,
    message: data.message,
    details: { service: data.service },
    ip,
  })
  return NextResponse.json({ success: true, message: 'Contact form submitted successfully' })
})
