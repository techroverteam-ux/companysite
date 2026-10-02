import { NextResponse } from 'next/server'
import { dayUTC, isManager, requireUser, route, visibleProjectIds } from '@/lib/api'
import { Activity, Task, TimeLog, User } from '@/lib/models'

function weekStart(d: Date) {
  const day = dayUTC(d)
  const dow = (day.getUTCDay() + 6) % 7 // Monday = 0
  return new Date(day.getTime() - dow * 864e5)
}

/** Numbers for the My Work screen; managers also get team workload and recent activity. */
export const GET = route(async (req) => {
  const me = await requireUser(req)
  const now = new Date()
  const today = dayUTC(now)
  const monday = weekStart(now)

  const [myOpen, myOverdue, todayMin, weekMin] = await Promise.all([
    Task.countDocuments({ assignees: me._id, status: { $ne: 'done' } }),
    Task.countDocuments({ assignees: me._id, status: { $ne: 'done' }, dueDate: { $lt: today } }),
    TimeLog.aggregate([{ $match: { user: me._id, running: false, date: today } }, { $group: { _id: null, m: { $sum: '$minutes' } } }]),
    TimeLog.aggregate([{ $match: { user: me._id, running: false, date: { $gte: monday } } }, { $group: { _id: null, m: { $sum: '$minutes' } } }]),
  ])

  const result: Record<string, unknown> = {
    me: {
      openTasks: myOpen,
      overdueTasks: myOverdue,
      minutesToday: todayMin[0]?.m ?? 0,
      minutesThisWeek: weekMin[0]?.m ?? 0,
      weeklyCapacityHours: me.weeklyCapacityHours,
    },
    weekStart: monday.toISOString().slice(0, 10),
  }

  const visible = await visibleProjectIds(me)
  const activityFilter = visible ? { project: { $in: visible } } : {}
  const activity = await Activity.find(activityFilter).sort({ createdAt: -1 }).limit(isManager(me) ? 25 : 12).lean()
  result.activity = activity.map((a) => ({ id: String(a._id), summary: a.summary, action: a.action, at: a.createdAt, actor: a.actor ? String(a.actor) : null }))

  if (isManager(me)) {
    const [users, open, overdue, week, running] = await Promise.all([
      User.find({ active: true }, { name: 1, title: 1, color: 1, weeklyCapacityHours: 1, role: 1 }).sort({ name: 1 }).lean(),
      Task.aggregate([{ $match: { status: { $ne: 'done' } } }, { $unwind: '$assignees' }, { $group: { _id: '$assignees', n: { $sum: 1 }, est: { $sum: '$estimateHours' } } }]),
      Task.aggregate([{ $match: { status: { $ne: 'done' }, dueDate: { $lt: today } } }, { $unwind: '$assignees' }, { $group: { _id: '$assignees', n: { $sum: 1 } } }]),
      TimeLog.aggregate([{ $match: { running: false, date: { $gte: monday } } }, { $group: { _id: '$user', m: { $sum: '$minutes' } } }]),
      TimeLog.find({ running: true }, { user: 1, task: 1, project: 1, startedAt: 1 }).lean(),
    ])
    const o = new Map(open.map((x) => [String(x._id), x]))
    const od = new Map(overdue.map((x) => [String(x._id), x.n as number]))
    const w = new Map(week.map((x) => [String(x._id), x.m as number]))
    const r = new Map(running.map((x) => [String(x.user), x]))
    const unassigned = await Task.countDocuments({ status: { $ne: 'done' }, assignees: { $size: 0 } })
    result.team = users.map((u) => {
      const id = String(u._id)
      const run = r.get(id)
      return {
        id,
        name: u.name,
        title: u.title,
        color: u.color,
        role: u.role,
        openTasks: o.get(id)?.n ?? 0,
        openEstimateHours: o.get(id)?.est ?? 0,
        overdueTasks: od.get(id) ?? 0,
        minutesThisWeek: w.get(id) ?? 0,
        weeklyCapacityHours: u.weeklyCapacityHours ?? 40,
        timer: run ? { task: run.task ? String(run.task) : null, project: String(run.project), startedAt: run.startedAt } : null,
      }
    })
    result.unassignedTasks = unassigned
  }

  return NextResponse.json(result)
})
