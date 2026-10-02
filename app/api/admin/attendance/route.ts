import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, isManager, oid, parseBody, requireUser, route } from '@/lib/api'
import { Attendance, Leave, User } from '@/lib/models'
import { managerIds, notify, todayIST } from '@/lib/workflow'

function serialize(a: any) {
  return {
    id: String(a._id),
    user: String(a.user),
    date: a.date,
    checkIn: a.checkIn ?? null,
    checkOut: a.checkOut ?? null,
    minutes: a.checkIn && a.checkOut ? Math.round((new Date(a.checkOut).getTime() - new Date(a.checkIn).getTime()) / 60000) : 0,
    plan: a.plan ?? '',
    summary: a.summary ?? '',
    mode: a.mode ?? 'office',
  }
}

/**
 * Attendance for a date range. Members see their own; managers see everyone.
 * Also returns approved leave in the range so the grid can show it.
 */
export const GET = route(async (req) => {
  const me = await requireUser(req)
  const sp = req.nextUrl.searchParams
  const today = todayIST()
  const from = sp.get('from') || today
  const to = sp.get('to') || today
  const filter: Record<string, unknown> = { date: { $gte: from, $lte: to } }
  const leaveFilter: Record<string, unknown> = { status: 'approved', from: { $lte: to }, to: { $gte: from } }
  if (!isManager(me)) {
    filter.user = me._id
    leaveFilter.user = me._id
  } else if (sp.get('user')) {
    filter.user = oid(sp.get('user'), 'user')
    leaveFilter.user = filter.user
  }
  const [rows, leaves, mine] = await Promise.all([
    Attendance.find(filter).sort({ date: -1 }).lean(),
    Leave.find(leaveFilter).lean(),
    Attendance.findOne({ user: me._id, date: today }).lean(),
  ])
  return NextResponse.json({
    today,
    mine: mine ? serialize(mine) : null,
    rows: rows.map(serialize),
    leaves: leaves.map((l) => ({ id: String(l._id), user: String(l.user), from: l.from, to: l.to, type: l.type, halfDay: l.halfDay })),
  })
})

const schema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('check_in'), plan: z.string().max(2000).default(''), mode: z.enum(['office', 'remote']).default('office') }),
  z.object({ action: z.literal('check_out'), summary: z.string().max(4000).default('') }),
  z.object({ action: z.literal('update'), plan: z.string().max(2000).optional(), summary: z.string().max(4000).optional() }),
])

/** Check in (with today's plan), check out (with what got done / blockers), or edit today's notes. */
export const POST = route(async (req) => {
  const me = await requireUser(req)
  const input = await parseBody(req, schema)
  const date = todayIST()
  let row = await Attendance.findOne({ user: me._id, date })

  if (input.action === 'check_in') {
    if (row?.checkIn) throw new ApiError(409, 'You already checked in today.')
    row = row ?? new Attendance({ user: me._id, date })
    row.checkIn = new Date()
    row.plan = input.plan
    row.mode = input.mode
    await row.save()
  } else if (input.action === 'check_out') {
    if (!row?.checkIn) throw new ApiError(400, 'Check in first.')
    row.checkOut = new Date()
    row.summary = input.summary
    await row.save()
    if (/block|stuck|waiting|help/i.test(input.summary)) {
      const u = await User.findById(me._id, { name: 1 }).lean()
      await notify(await managerIds(), { title: `${u?.name} flagged a blocker`, body: input.summary.slice(0, 200), tab: 'attendance' }, { skip: me.id })
    }
  } else {
    if (!row) throw new ApiError(400, 'Check in first.')
    if (input.plan !== undefined) row.plan = input.plan
    if (input.summary !== undefined) row.summary = input.summary
    await row.save()
  }
  return NextResponse.json({ mine: serialize(row.toObject()) })
})
