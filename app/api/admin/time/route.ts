import { NextResponse } from 'next/server'
import { ApiError, dayUTC, isManager, logActivity, oid, parseBody, requireUser, route, visibleProjectIds } from '@/lib/api'
import { timeInput } from '@/lib/schemas'
import { TimeLog, User } from '@/lib/models'
import { resolveTarget, serializeLog } from '@/lib/time'

export const GET = route(async (req) => {
  const me = await requireUser(req)
  const sp = req.nextUrl.searchParams
  const filter: Record<string, unknown> = {}

  const user = sp.get('user')
  if (!isManager(me)) filter.user = me._id
  else if (user && user !== 'all') filter.user = user === 'me' ? me._id : oid(user, 'user')

  const from = sp.get('from')
  const to = sp.get('to')
  if (from || to) {
    filter.date = {
      ...(from ? { $gte: dayUTC(from) } : {}),
      ...(to ? { $lte: dayUTC(to) } : {}),
    }
  }
  const project = sp.get('project')
  if (project) filter.project = oid(project, 'project')
  const task = sp.get('task')
  if (task) filter.task = oid(task, 'task')

  const visible = await visibleProjectIds(me)
  if (visible && !filter.project) filter.project = { $in: visible }

  const logs = await TimeLog.find(filter).sort({ date: -1, createdAt: -1 }).limit(2000).lean()
  return NextResponse.json({ logs: logs.map(serializeLog) })
})

export const POST = route(async (req) => {
  const me = await requireUser(req)
  const input = await parseBody(req, timeInput)
  let userId = me._id
  if (input.user && input.user !== me.id) {
    if (!isManager(me)) throw new ApiError(403, 'You can only log your own time.')
    const target = await User.findOne({ _id: input.user, active: true }, { _id: 1 }).lean()
    if (!target) throw new ApiError(400, 'That team member is not active.')
    userId = target._id
  }
  const date = dayUTC(input.date)
  if (date.getTime() > Date.now() + 36 * 3600 * 1000) throw new ApiError(400, 'You cannot log time for a future date.')

  const target = await resolveTarget(me, input.project, input.task)
  const log = await TimeLog.create({
    user: userId,
    project: target.project,
    task: target.task,
    date,
    minutes: input.minutes,
    note: input.note,
    billable: input.billable,
  })
  await logActivity(me, 'time.logged', 'TimeLog', log._id, `${me.name} logged ${(input.minutes / 60).toFixed(2)} h`, target.project)
  return NextResponse.json({ log: serializeLog(log.toObject()) }, { status: 201 })
})
