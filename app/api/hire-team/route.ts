import { NextResponse } from 'next/server'
import { clientIp, parseBody, rateLimit, route } from '@/lib/api'
import { hireTeamLead } from '@/lib/leads'
import { Lead } from '@/lib/models'
import { alertNewLead } from '@/lib/workflow'

export const POST = route(async (req) => {
  const ip = clientIp(req)
  rateLimit(`lead:${ip}`, 5, 60_000)
  const data = await parseBody(req, hireTeamLead)
  if (data.website) return NextResponse.json({ success: true }) // bot

  const lead = await Lead.create({
    type: 'hire_team',
    name: data.contactName,
    email: data.email,
    phone: data.phone,
    message: data.description,
    details: {
      projectTitle: data.projectTitle,
      budget: data.budget,
      timeline: data.timeline,
      selectedRoles: data.selectedRoles,
    },
    ip,
  })
  await alertNewLead(lead).catch((e) => console.error('[lead alert]', e))
  return NextResponse.json({ success: true, message: 'Request submitted successfully', requestId: String(lead._id) })
})
