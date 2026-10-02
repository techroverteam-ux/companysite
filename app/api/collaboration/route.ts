import { NextResponse } from 'next/server'
import { clientIp, parseBody, rateLimit, route } from '@/lib/api'
import { collaborationLead } from '@/lib/leads'
import { Lead } from '@/lib/models'
import { alertNewLead } from '@/lib/workflow'

export const POST = route(async (req) => {
  const ip = clientIp(req)
  rateLimit(`lead:${ip}`, 5, 60_000)
  const data = await parseBody(req, collaborationLead)
  if (data.website) return NextResponse.json({ success: true }) // bot

  const lead = await Lead.create({
    type: 'collaboration',
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.idea,
    details: {
      experience: data.experience,
      collaborationType: data.collaborationType,
      portfolio: data.portfolio,
    },
    ip,
  })
  await alertNewLead(lead).catch((e) => console.error('[lead alert]', e))
  return NextResponse.json({ success: true, message: 'Collaboration proposal submitted successfully' })
})
