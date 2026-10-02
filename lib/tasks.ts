import { Types } from 'mongoose'
import { ApiError } from '@/lib/api'
import { Project, User } from '@/lib/models'

export function serializeTask(t: any, loggedMinutes = 0) {
  return {
    id: String(t._id),
    project: String(t.project),
    title: t.title,
    description: t.description ?? '',
    status: t.status,
    priority: t.priority,
    assignees: (t.assignees ?? []).map(String),
    dueDate: t.dueDate ?? null,
    estimateHours: t.estimateHours ?? 0,
    labels: t.labels ?? [],
    link: t.link ?? '',
    position: t.position ?? 0,
    completedAt: t.completedAt ?? null,
    createdBy: t.createdBy ? String(t.createdBy) : null,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    loggedMinutes,
  }
}

export async function ensureActiveUsers(ids: string[]) {
  if (!ids.length) return
  const count = await User.countDocuments({ _id: { $in: ids }, active: true })
  if (count !== ids.length) throw new ApiError(400, 'One of the assignees is not an active team member.')
}

/** Assigning someone to a task adds them to the project so they can see it. */
export async function addToProject(projectId: Types.ObjectId, userIds: string[]) {
  if (!userIds.length) return
  await Project.updateOne({ _id: projectId }, { $addToSet: { members: { $each: userIds.map((u) => new Types.ObjectId(u)) } } })
}
