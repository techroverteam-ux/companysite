import { NextResponse } from 'next/server'
import { z } from 'zod'
import { assertProjectAccess, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { Milestone } from '@/lib/models'
import { milestonesWithStats, serializeMilestone } from '@/lib/delivery'

type Ctx = { params: Promise<{ id: string }> }

export const GET = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req)
  const id = oid((await params).id)
  await assertProjectAccess(me, id)
  return NextResponse.json({ milestones: await milestonesWithStats(id) })
})

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().max(5000).default(''),
  dueDate: z.string().date().nullable().optional(),
  percent: z.coerce.number().min(0).max(100).default(0),
})

export const POST = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const id = oid((await params).id)
  const project = await assertProjectAccess(me, id)
  const input = await parseBody(req, schema)
  const count = await Milestone.countDocuments({ project: id })
  const m = await Milestone.create({ ...input, dueDate: input.dueDate || undefined, project: id, order: count })
  await logActivity(me, 'milestone.created', 'Milestone', m._id, `${me.name} added milestone “${m.title}” to ${project.name}`, id)
  return NextResponse.json({ milestone: serializeMilestone(m.toObject()) }, { status: 201 })
})
