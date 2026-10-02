import { NextResponse } from 'next/server'
import { ApiError, assertProjectAccess, isManager, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { taskPatch } from '@/lib/schemas'
import { Comment, Task, TimeLog, User } from '@/lib/models'
import { addToProject, ensureActiveUsers, serializeTask } from '@/lib/tasks'
import { managerIds, notify } from '@/lib/workflow'

type Ctx = { params: Promise<{ id: string }> }

const STATUS_LABEL: Record<string, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  review: 'Code review',
  qa: 'QA',
  done: 'Done',
}

async function loadTask(id: string) {
  const task = await Task.findById(oid(id))
  if (!task) throw new ApiError(404, 'Task not found.')
  return task
}

export const GET = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req)
  const task = await loadTask((await params).id)
  await assertProjectAccess(me, task.project)
  const [logs, comments] = await Promise.all([
    TimeLog.find({ task: task._id }).sort({ date: -1, createdAt: -1 }).lean(),
    Comment.find({ task: task._id }).sort({ createdAt: 1 }).lean(),
  ])
  const logged = logs.filter((l) => !l.running).reduce((s, l) => s + (l.minutes ?? 0), 0)
  return NextResponse.json({
    task: serializeTask(task.toObject(), logged),
    timeLogs: logs.map((l) => ({
      id: String(l._id),
      user: String(l.user),
      date: l.date,
      minutes: l.minutes,
      note: l.note,
      billable: l.billable,
      running: l.running,
      startedAt: l.startedAt,
    })),
    comments: comments.map((c) => ({ id: String(c._id), user: c.user ? String(c.user) : null, authorName: c.authorName ?? '', text: c.text, createdAt: c.createdAt })),
  })
})

export const PATCH = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req)
  const task = await loadTask((await params).id)
  const project = await assertProjectAccess(me, task.project)
  const input = await parseBody(req, taskPatch)
  const manager = isManager(me)
  const changes: string[] = []
  let newlyAssigned: string[] = []

  if (input.project && input.project !== String(task.project)) {
    if (!manager) throw new ApiError(403, 'Only a manager can move a task to another project.')
    await assertProjectAccess(me, oid(input.project, 'project'))
    task.set('project', input.project)
    changes.push('moved project')
  }

  if (input.assignees) {
    const next = Array.from(new Set(input.assignees))
    const prev = task.assignees.map(String)
    if (!manager) {
      // Members may only add or remove themselves.
      const others = (list: string[]) => list.filter((x) => x !== me.id).sort().join(',')
      if (others(next) !== others(prev)) throw new ApiError(403, 'Only a manager can assign tasks to other people.')
    }
    await ensureActiveUsers(next)
    await addToProject(task.project, next)
    newlyAssigned = next.filter((x) => !prev.includes(x))
    if (next.sort().join(',') !== prev.sort().join(',')) {
      const names = (await User.find({ _id: { $in: next } }, { name: 1 }).lean()).map((u) => u.name)
      changes.push(next.length ? `assigned to ${names.join(', ')}` : 'unassigned')
    }
    task.set('assignees', next)
  }

  if (input.status && input.status !== task.status) {
    changes.push(`moved to ${STATUS_LABEL[input.status]}`)
    task.status = input.status
    task.set('completedAt', input.status === 'done' ? new Date() : undefined)
  }

  const { project: _p, assignees: _a, status: _s, dueDate, milestone, ...rest } = input
  Object.assign(task, rest)
  if (dueDate !== undefined) task.set('dueDate', dueDate || undefined)
  if (milestone !== undefined) task.set('milestone', milestone || undefined)
  if (Object.keys(rest).length || dueDate !== undefined || milestone !== undefined) changes.push('edited details')

  // Optional explicit board position (drag and drop).
  const position = Number(req.nextUrl.searchParams.get('position'))
  if (Number.isFinite(position) && req.nextUrl.searchParams.has('position')) task.position = position

  await task.save()
  const label = `TR-${task.number ?? ''} ${task.title}`.trim()
  if (newlyAssigned.length) {
    await notify(newlyAssigned, { title: `New task for you: ${label}`, body: `${me.name} assigned you in ${project.name}.`, tab: 'tasks', task: task._id, project: project._id }, { skip: me.id, email: true })
  }
  if (input.status === 'review' || input.status === 'qa') {
    const reviewers = [...(project.lead ? [String(project.lead)] : []), ...(await managerIds())]
    await notify(reviewers, { title: `${label} is ready for ${input.status === 'review' ? 'code review' : 'QA'}`, body: `Moved by ${me.name}.`, tab: 'tasks', task: task._id, project: project._id }, { skip: me.id })
  }
  if (changes.length) {
    await logActivity(me, 'task.updated', 'Task', task._id, `${me.name} ${changes.join(', ')}: “${task.title}”`, project._id)
  }
  return NextResponse.json({ task: serializeTask(task.toObject()) })
})

export const DELETE = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req)
  const task = await loadTask((await params).id)
  const project = await assertProjectAccess(me, task.project)
  if (!isManager(me) && String(task.createdBy) !== me.id) {
    throw new ApiError(403, 'Only a manager or the person who created this task can delete it.')
  }
  if (await TimeLog.exists({ task: task._id })) {
    throw new ApiError(409, 'This task has time logged against it. Mark it Done instead, or delete the time entries first.')
  }
  await Comment.deleteMany({ task: task._id })
  await task.deleteOne()
  await logActivity(me, 'task.deleted', 'Task', task._id, `${me.name} deleted “${task.title}”`, project._id)
  return NextResponse.json({ ok: true })
})
