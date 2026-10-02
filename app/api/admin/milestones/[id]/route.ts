import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { AccessLink, Invoice, MILESTONE_STATUSES, Milestone, Project, Task } from '@/lib/models'
import { serializeMilestone } from '@/lib/delivery'
import { emailLayout, sendEmail } from '@/lib/workflow'

type Ctx = { params: Promise<{ id: string }> }

const schema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  description: z.string().max(5000).optional(),
  dueDate: z.string().date().nullable().optional(),
  percent: z.coerce.number().min(0).max(100).optional(),
  status: z.enum(MILESTONE_STATUSES).optional(),
  order: z.coerce.number().optional(),
})

export const PATCH = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const m = await Milestone.findById(oid((await params).id))
  if (!m) throw new ApiError(404, 'Milestone not found.')
  const input = await parseBody(req, schema)
  const { dueDate, ...rest } = input
  const becameReady = input.status === 'ready_for_uat' && m.status !== 'ready_for_uat'
  Object.assign(m, rest)
  if (dueDate !== undefined) m.set('dueDate', dueDate || undefined)
  await m.save()
  const project = await Project.findById(m.project, { name: 1 }).lean()
  if (becameReady) {
    // Let the client know there is something to test (if we have their email on a portal link).
    const links = await AccessLink.find({ project: m.project, kind: 'portal', revokedAt: null, expiresAt: { $gt: new Date() }, email: { $ne: '' } }, { email: 1 }).lean()
    if (links.length) {
      await sendEmail(links.map((l) => l.email), `Ready for your review: ${m.title}`, emailLayout(`“${m.title}” is ready for your testing`, `<p>Please open your TechRover project portal to test and approve this milestone, or request changes.</p>`))
    }
  }
  await logActivity(me, 'milestone.updated', 'Milestone', m._id, `${me.name} updated milestone “${m.title}”${input.status ? ` → ${input.status.replace(/_/g, ' ')}` : ''} in ${project?.name ?? ''}`, m.project)
  return NextResponse.json({ milestone: serializeMilestone(m.toObject()) })
})

export const DELETE = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const m = await Milestone.findById(oid((await params).id))
  if (!m) throw new ApiError(404, 'Milestone not found.')
  if (await Invoice.exists({ milestone: m._id, status: { $in: ['sent', 'paid'] } })) throw new ApiError(409, 'This milestone has a sent or paid invoice.')
  await Task.updateMany({ milestone: m._id }, { $unset: { milestone: 1 } })
  await m.deleteOne()
  await logActivity(me, 'milestone.deleted', 'Milestone', m._id, `${me.name} removed milestone “${m.title}”`, m.project)
  return NextResponse.json({ ok: true })
})
