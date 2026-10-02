import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { logActivity, parseBody, requireUser, route, visibleProjectIds } from '@/lib/api'
import { projectInput } from '@/lib/schemas'
import { PROJECT_STATUSES, Project, Task, TimeLog } from '@/lib/models'


export const GET = route(async (req) => {
  const me = await requireUser(req)
  const ids = await visibleProjectIds(me)
  const status = req.nextUrl.searchParams.get('status')
  const filter: Record<string, unknown> = ids ? { _id: { $in: ids } } : {}
  if (status && (PROJECT_STATUSES as readonly string[]).includes(status)) filter.status = status

  const projects = await Project.find(filter).sort({ status: 1, dueDate: 1, createdAt: -1 }).lean()
  const projectIds = projects.map((p) => p._id as Types.ObjectId)
  const now = new Date()

  // Computed in JS (portable across MongoDB versions; project counts are small).
  const [taskRows, timeStats] = await Promise.all([
    Task.find({ project: { $in: projectIds } }, { project: 1, status: 1, dueDate: 1, estimateHours: 1 }).lean(),
    TimeLog.aggregate([
      { $match: { project: { $in: projectIds }, running: false } },
      { $group: { _id: '$project', minutes: { $sum: '$minutes' } } },
    ]),
  ])
  const taskStats = new Map<string, { total: number; done: number; overdue: number; estimateHours: number }>()
  for (const task of taskRows) {
    const key = String(task.project)
    const s = taskStats.get(key) ?? { total: 0, done: 0, overdue: 0, estimateHours: 0 }
    s.total += 1
    if (task.status === 'done') s.done += 1
    else if (task.dueDate && task.dueDate < now) s.overdue += 1
    s.estimateHours += task.estimateHours ?? 0
    taskStats.set(key, s)
  }
  const t = taskStats
  const m = new Map(timeStats.map((s) => [String(s._id), s.minutes as number]))

  return NextResponse.json({
    projects: projects.map((p) => {
      const s = t.get(String(p._id))
      return {
        id: String(p._id),
        name: p.name,
        client: p.client,
        description: p.description,
        status: p.status,
        startDate: p.startDate,
        dueDate: p.dueDate,
        budgetHours: p.budgetHours,
        lead: p.lead ? String(p.lead) : null,
        members: (p.members ?? []).map(String),
        repoUrl: p.repoUrl,
        stats: {
          tasks: s?.total ?? 0,
          done: s?.done ?? 0,
          overdue: s?.overdue ?? 0,
          estimateHours: s?.estimateHours ?? 0,
          loggedMinutes: m.get(String(p._id)) ?? 0,
        },
      }
    }),
  })
})

export const POST = route(async (req) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const input = await parseBody(req, projectInput)
  const members = Array.from(new Set([...(input.members ?? []), ...(input.lead ? [input.lead] : [])]))
  const project = await Project.create({
    ...input,
    startDate: input.startDate || undefined,
    dueDate: input.dueDate || undefined,
    lead: input.lead || undefined,
    members,
    createdBy: me._id,
  })
  await logActivity(me, 'project.created', 'Project', project._id, `${me.name} created project ${project.name}`, project._id)
  return NextResponse.json({ id: String(project._id) }, { status: 201 })
})
