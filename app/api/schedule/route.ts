import { NextResponse } from 'next/server'
import { ApiError, clientIp, parseBody, rateLimit, route } from '@/lib/api'
import { meetingLead } from '@/lib/leads'
import { Lead } from '@/lib/models'

export const POST = route(async (req) => {
  const ip = clientIp(req)
  rateLimit(`lead:${ip}`, 5, 60_000)
  const data = await parseBody(req, meetingLead)
  if (data.website) return NextResponse.json({ success: true }) // bot

  const todayIST = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10)
  if (data.date < todayIST) throw new ApiError(400, 'Please choose a date in the future.')

  const clash = await Lead.exists({
    type: 'meeting',
    meetingDate: data.date,
    meetingTime: data.time,
    status: { $nin: ['lost', 'spam'] },
  })
  if (clash) throw new ApiError(409, 'That time slot was just booked. Please pick another time.')

  await Lead.create({
    type: 'meeting',
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    message: data.message,
    meetingDate: data.date,
    meetingTime: data.time,
    details: { meetingType: data.meetingType },
    ip,
  })
  // Status starts as "new" (pending): a team member confirms the meeting from the admin.
  return NextResponse.json({ success: true, message: 'Meeting request received' })
})
