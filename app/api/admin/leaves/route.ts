import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, isManager, logActivity, parseBody, requireUser, route } from '@/lib/api'
import { LEAVE_STATUSES, LEAVE_TYPES, Leave } from '@/lib/models'
import { managerIds, notify } from '@/lib/workflow'

function serializeLeave(l: any) {
  return {
    id: String(l._id),
    user: String(l.user),
    from: l.from,
    to: l.to,
    type: l.type,
    halfDay: !!l.halfDay,
    reason: l.reason ?? '',
    status: l.status,
    decidedBy: l.decidedBy ? String(l.decidedBy) : null,
    decidedAt: l.decidedAt ?? null,
    decisionNote: l.decisionNote ?? '',
    createdAt: l.createdAt,
  }
}

export const GET = route(async (req) => {
  const me = await requireUser(req)
  const status = req.nextUrl.searchParams.get('status')
  const filter: Record<string, unknown> = isManager(me) && req.nextUrl.searchParams.get('scope') !== 'mine' ? {} : { user: me._id }
  if (status && (LEAVE_STATUSES as readonly string[]).includes(status)) filter.status = status
  const leaves = await Leave.find(filter).sort({ from: -1 }).limit(300).lean()
  return NextResponse.json({ leaves: leaves.map(serializeLeave) })
})

const schema = z
  .object({
    from: z.string().date(),
    to: z.string().date(),
    type: z.enum(LEAVE_TYPES).default('casual'),
    halfDay: z.boolean().default(false),
    reason: z.string().trim().max(1000).default(''),
  })
  .refine((v) => v.to >= v.from, { message: 'End date must be on or after the start date.', path: ['to'] })

export const POST = route(async (req) => {
  const me = await requireUser(req)
  const input = await parseBody(req, schema)
  const overlap = await Leave.exists({ user: me._id, status: { $in: ['pending', 'approved'] }, from: { $lte: input.to }, to: { $gte: input.from } })
  if (overlap) throw new ApiError(409, 'You already have leave requested for some of these days.')
  const leave = await Leave.create({ ...input, user: me._id })
  await notify(await managerIds(), { title: `${me.name} requested ${input.type === 'wfh' ? 'work from home' : `${input.type} leave`}`, body: `${input.from}${input.to !== input.from ? ` to ${input.to}` : ''}${input.reason ? ` · ${input.reason}` : ''}`, tab: 'attendance' }, { skip: me.id, email: true })
  await logActivity(me, 'leave.requested', 'Leave', leave._id, `${me.name} requested leave ${input.from} to ${input.to}`)
  return NextResponse.json({ leave: serializeLeave(leave.toObject()) }, { status: 201 })
})
