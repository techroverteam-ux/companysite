import { NextResponse } from 'next/server'
import { ApiError, assertProjectAccess, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { projectPatch } from '@/lib/schemas'
import { Comment, Project, Task, TimeLog } from '@/lib/models'

type Ctx = { params: Promise<{ id: string }> }

export const GET = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req)
  const project = await assertProjectAccess(me, oid((await params).id))
  return NextResponse.json({
    project: {
      ...project,
      id: String(project._id),
      lead: project.lead ? String(project.lead) : null,
      members: (project.members ?? []).map(String),
    },
  })
})

export const PATCH = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const id = oid((await params).id)
  const input = await parseBody(req, projectPatch)
  const project = await Project.findById(id)
  if (!project) throw new ApiError(404, 'Project not found.')

  const { startDate, dueDate, lead, members, clientRef, ...rest } = input
  if (rest.stage && rest.stage !== project.stage && rest.stage === 'support' && !project.deliveredAt) {
    // Delivery signed off: warranty / support period starts.
    project.deliveredAt = new Date()
    project.warrantyEndsAt = new Date(Date.now() + Number(process.env.WARRANTY_DAYS || 90) * 864e5)
  }
  Object.assign(project, rest)
  if (clientRef !== undefined) project.set('clientRef', clientRef || undefined)
  if (startDate !== undefined) project.set('startDate', startDate || undefined)
  if (dueDate !== undefined) project.set('dueDate', dueDate || undefined)
  if (lead !== undefined) project.set('lead', lead || undefined)
  if (members !== undefined || lead) {
    const next = new Set([...(members ?? project.members.map(String)), ...(project.lead ? [String(project.lead)] : [])])
    project.set('members', Array.from(next))
  }
  await project.save()
  await logActivity(me, 'project.updated', 'Project', project._id, `${me.name} updated project ${project.name}`, project._id)
  return NextResponse.json({ ok: true })
})

/** Owner only. Removes the project with its tasks, comments and time logs. Prefer status "cancelled" to archive. */
export const DELETE = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner'])
  const id = oid((await params).id)
  const project = await Project.findById(id)
  if (!project) throw new ApiError(404, 'Project not found.')
  const taskIds = (await Task.find({ project: id }, { _id: 1 }).lean()).map((t) => t._id)
  await Promise.all([
    Comment.deleteMany({ task: { $in: taskIds } }),
    TimeLog.deleteMany({ project: id }),
    Task.deleteMany({ project: id }),
  ])
  await project.deleteOne()
  await logActivity(me, 'project.deleted', 'Project', id, `${me.name} deleted project ${project.name}`)
  return NextResponse.json({ ok: true })
})
