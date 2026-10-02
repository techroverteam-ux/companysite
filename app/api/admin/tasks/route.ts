import { NextResponse } from 'next/server'
import {
  ApiError,
  assertProjectAccess,
  isManager,
  logActivity,
  oid,
  parseBody,
  requireUser,
  route,
  visibleProjectIds,
} from '@/lib/api'
import { taskInput } from '@/lib/schemas'
import { TASK_PRIORITIES, TASK_STATUSES, Task, TimeLog } from '@/lib/models'
import { addToProject, ensureActiveUsers, serializeTask } from '@/lib/tasks'

export const GET = route(async (req) => {
  const me = await requireUser(req)
  const sp = req.nextUrl.searchParams
  const visible = await visibleProjectIds(me)
  const filter: Record<string, unknown> = {}

  const project = sp.get('project')
  if (project) {
    const pid = oid(project, 'project')
    if (visible && !visible.some((v) => v.equals(pid))) throw new ApiError(403, 'You are not on this project.')
    filter.project = pid
  } else if (visible) {
    filter.project = { $in: visible }
  }

  const assignee = sp.get('assignee')
  if (assignee === 'me') filter.assignees = me._id
  else if (assignee === 'none') filter.assignees = { $size: 0 }
  else if (assignee) filter.assignees = oid(assignee, 'assignee')

  const status = sp.get('status')
  if (status === 'open') filter.status = { $ne: 'done' }
  else if (status && (TASK_STATUSES as readonly string[]).includes(status)) filter.status = status

  const priority = sp.get('priority')
  if (priority && (TASK_PRIORITIES as readonly string[]).includes(priority)) filter.priority = priority

  const q = sp.get('q')?.trim()
  if (q) filter.title = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }

  const tasks = await Task.find(filter).sort({ position: 1, dueDate: 1, createdAt: -1 }).limit(1000).lean()
  const logged = await TimeLog.aggregate([
    { $match: { task: { $in: tasks.map((t) => t._id) }, running: false } },
    { $group: { _id: '$task', minutes: { $sum: '$minutes' } } },
  ])
  const byTask = new Map(logged.map((l) => [String(l._id), l.minutes as number]))
  return NextResponse.json({ tasks: tasks.map((t) => serializeTask(t, byTask.get(String(t._id)) ?? 0)) })
})

export const POST = route(async (req) => {
  const me = await requireUser(req)
  const input = await parseBody(req, taskInput)
  const projectId = oid(input.project, 'project')
  const project = await assertProjectAccess(me, projectId)

  let assignees = Array.from(new Set(input.assignees))
  if (!isManager(me) && assignees.some((a) => a !== me.id)) {
    throw new ApiError(403, 'Only a manager can assign tasks to other people. You can assign it to yourself.')
  }
  await ensureActiveUsers(assignees)
  await addToProject(projectId, assignees)

  const last = await Task.findOne({ project: projectId, status: input.status }).sort({ position: -1 }).lean()
  const task = await Task.create({
    ...input,
    project: projectId,
    assignees,
    dueDate: input.dueDate || undefined,
    position: (last?.position ?? 0) + 1000,
    completedAt: input.status === 'done' ? new Date() : undefined,
    createdBy: me._id,
  })
  await logActivity(me, 'task.created', 'Task', task._id, `${me.name} created “${task.title}” in ${project.name}`, projectId)
  return NextResponse.json({ task: serializeTask(task.toObject()) }, { status: 201 })
})
