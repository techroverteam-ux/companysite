import { NextResponse } from 'next/server'
import { requireUser, route } from '@/lib/api'
import { LEAD_STATUSES, LEAD_TYPES, Lead } from '@/lib/models'

export const GET = route(async (req) => {
  await requireUser(req, ['owner', 'manager'])
  const sp = req.nextUrl.searchParams
  const filter: Record<string, unknown> = {}
  const type = sp.get('type')
  if (type && (LEAD_TYPES as readonly string[]).includes(type)) filter.type = type
  const status = sp.get('status')
  if (status && (LEAD_STATUSES as readonly string[]).includes(status)) filter.status = status
  const leads = await Lead.find(filter).sort({ createdAt: -1 }).limit(1000).lean()
  return NextResponse.json({
    leads: leads.map((l) => ({
      id: String(l._id),
      type: l.type,
      name: l.name,
      email: l.email,
      phone: l.phone,
      company: l.company,
      message: l.message,
      details: l.details ?? {},
      meetingDate: l.meetingDate ?? null,
      meetingTime: l.meetingTime ?? null,
      status: l.status,
      owner: l.owner ? String(l.owner) : null,
      notes: l.notes ?? '',
      createdAt: l.createdAt,
    })),
  })
})
