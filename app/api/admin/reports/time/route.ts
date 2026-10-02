import { NextResponse } from 'next/server'
import { dayUTC, isManager, oid, requireUser, route, visibleProjectIds } from '@/lib/api'
import { Project, Task, TimeLog, User } from '@/lib/models'

/**
 * Time report for a date range.
 * Managers see everyone (with cost from hourly rates); members see only their own time.
 */
export const GET = route(async (req) => {
  const me = await requireUser(req)
  const sp = req.nextUrl.searchParams
  const today = new Date()
  const from = dayUTC(sp.get('from') || new Date(today.getTime() - 6 * 864e5))
  const to = dayUTC(sp.get('to') || today)

  const match: Record<string, unknown> = { running: false, date: { $gte: from, $lte: to } }
  if (!isManager(me)) match.user = me._id
  else if (sp.get('user')) match.user = oid(sp.get('user'), 'user')
  if (sp.get('project')) match.project = oid(sp.get('project'), 'project')
  const visible = await visibleProjectIds(me)
  if (visible && !match.project) match.project = { $in: visible }

  // Group in JS (portable across MongoDB versions).
  const logs = await TimeLog.find(match, { user: 1, project: 1, task: 1, date: 1, minutes: 1, billable: 1 }).lean()
  const grouped = new Map<string, { _id: { user: unknown; project: unknown; task: unknown; day: string }; minutes: number; billableMinutes: number }>()
  for (const l of logs) {
    const day = new Date(l.date).toISOString().slice(0, 10)
    const key = `${l.user}|${l.project}|${l.task ?? ''}|${day}`
    const g = grouped.get(key) ?? { _id: { user: l.user, project: l.project, task: l.task ?? null, day }, minutes: 0, billableMinutes: 0 }
    g.minutes += l.minutes ?? 0
    if (l.billable !== false) g.billableMinutes += l.minutes ?? 0
    grouped.set(key, g)
  }
  const rows = Array.from(grouped.values())

  const userIds = Array.from(new Set(rows.map((r) => String(r._id.user))))
  const projectIds = Array.from(new Set(rows.map((r) => String(r._id.project))))
  const taskIds = Array.from(new Set(rows.filter((r) => r._id.task).map((r) => String(r._id.task))))
  const [users, projects, tasks] = await Promise.all([
    User.find({ _id: { $in: userIds } }, { name: 1, hourlyRate: 1, color: 1, weeklyCapacityHours: 1 }).lean(),
    Project.find({ _id: { $in: projectIds } }, { name: 1, client: 1, budgetHours: 1 }).lean(),
    Task.find({ _id: { $in: taskIds } }, { title: 1 }).lean(),
  ])
  const uMap = new Map(users.map((u) => [String(u._id), u]))
  const pMap = new Map(projects.map((p) => [String(p._id), p]))
  const tMap = new Map(tasks.map((t) => [String(t._id), t]))
  const showCost = isManager(me)

  type Agg = { minutes: number; billableMinutes: number; cost: number }
  const blank = (): Agg => ({ minutes: 0, billableMinutes: 0, cost: 0 })
  const byUser = new Map<string, Agg>()
  const byProject = new Map<string, Agg>()
  const byDay = new Map<string, number>()
  const detail: any[] = []
  const total = blank()

  for (const r of rows) {
    const u = String(r._id.user)
    const p = String(r._id.project)
    const rate = uMap.get(u)?.hourlyRate ?? 0
    const cost = (r.minutes / 60) * rate
    for (const [map, key] of [
      [byUser, u],
      [byProject, p],
    ] as const) {
      const a = map.get(key) ?? blank()
      a.minutes += r.minutes
      a.billableMinutes += r.billableMinutes
      a.cost += cost
      map.set(key, a)
    }
    byDay.set(r._id.day, (byDay.get(r._id.day) ?? 0) + r.minutes)
    total.minutes += r.minutes
    total.billableMinutes += r.billableMinutes
    total.cost += cost
    detail.push({
      day: r._id.day,
      user: u,
      userName: uMap.get(u)?.name ?? 'Former member',
      project: p,
      projectName: pMap.get(p)?.name ?? 'Deleted project',
      task: r._id.task ? String(r._id.task) : null,
      taskTitle: r._id.task ? tMap.get(String(r._id.task))?.title ?? 'Deleted task' : '(no task)',
      minutes: r.minutes,
      billableMinutes: r.billableMinutes,
      ...(showCost ? { cost: Math.round(cost) } : {}),
    })
  }

  const strip = (a: Agg) => ({ minutes: a.minutes, billableMinutes: a.billableMinutes, ...(showCost ? { cost: Math.round(a.cost) } : {}) })
  return NextResponse.json({
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
    total: strip(total),
    byUser: Array.from(byUser, ([id, a]) => ({ id, name: uMap.get(id)?.name ?? 'Former member', color: uMap.get(id)?.color, ...strip(a) })).sort((a, b) => b.minutes - a.minutes),
    byProject: Array.from(byProject, ([id, a]) => ({ id, name: pMap.get(id)?.name ?? 'Deleted project', client: pMap.get(id)?.client ?? '', budgetHours: pMap.get(id)?.budgetHours ?? 0, ...strip(a) })).sort((a, b) => b.minutes - a.minutes),
    byDay: Array.from(byDay, ([day, minutes]) => ({ day, minutes })).sort((a, b) => a.day.localeCompare(b.day)),
    detail: detail.sort((a, b) => b.day.localeCompare(a.day) || a.userName.localeCompare(b.userName)),
  })
})
