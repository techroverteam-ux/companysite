import { Types } from 'mongoose'
import { ApiError, assertProjectAccess, type CurrentUser, oid } from '@/lib/api'
import { Task, TimeLog } from '@/lib/models'

export function serializeLog(l: any) {
  return {
    id: String(l._id),
    user: String(l.user),
    project: String(l.project),
    task: l.task ? String(l.task) : null,
    date: l.date,
    minutes: l.minutes ?? 0,
    note: l.note ?? '',
    billable: l.billable ?? true,
    running: !!l.running,
    startedAt: l.startedAt ?? null,
    endedAt: l.endedAt ?? null,
    createdAt: l.createdAt,
  }
}

/** Resolve and permission-check the project (and task) a time entry belongs to. */
export async function resolveTarget(me: CurrentUser, projectId?: string, taskId?: string | null) {
  if (taskId) {
    const task = await Task.findById(oid(taskId, 'task')).lean()
    if (!task) throw new ApiError(404, 'Task not found.')
    await assertProjectAccess(me, task.project as Types.ObjectId)
    return { project: task.project as Types.ObjectId, task: task._id as Types.ObjectId }
  }
  if (!projectId) throw new ApiError(400, 'Pick a project or a task.')
  const pid = oid(projectId, 'project')
  await assertProjectAccess(me, pid)
  return { project: pid, task: undefined }
}

/** Stops the user's running timer, if any, and returns the finished entry. */
export async function stopRunningTimer(userId: Types.ObjectId) {
  const running = await TimeLog.findOne({ user: userId, running: true })
  if (!running) return null
  const end = new Date()
  const start = running.startedAt ?? end
  const minutes = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000))
  running.running = false
  running.endedAt = end
  running.minutes = Math.min(minutes, 24 * 60)
  await running.save()
  return running
}
