import { NextResponse } from 'next/server'
import { z } from 'zod'
import { assertProjectAccess, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { ChangeRequest } from '@/lib/models'
import { serializeChange } from '@/lib/delivery'

type Ctx = { params: Promise<{ id: string }> }

export const GET = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req)
  const id = oid((await params).id)
  await assertProjectAccess(me, id)
  const list = await ChangeRequest.find({ project: id }).sort({ createdAt: -1 }).lean()
  return NextResponse.json({ changes: list.map(serializeChange) })
})

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().max(5000).default(''),
  requesterName: z.string().max(120).default(''),
  estimateHours: z.coerce.number().min(0).max(10000).default(0),
  cost: z.coerce.number().min(0).max(1e9).default(0),
  daysAdded: z.coerce.number().min(0).max(1000).default(0),
})

export const POST = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req)
  const id = oid((await params).id)
  const project = await assertProjectAccess(me, id)
  const input = await parseBody(req, schema)
  const estimated = input.estimateHours > 0 || input.cost > 0
  const cr = await ChangeRequest.create({ ...input, project: id, source: 'staff', requesterName: input.requesterName || me.name, status: estimated ? 'estimated' : 'submitted', createdBy: me._id })
  await logActivity(me, 'change.created', 'ChangeRequest', cr._id, `${me.name} logged change request “${cr.title}” on ${project.name}`, id)
  return NextResponse.json({ change: serializeChange(cr.toObject()) }, { status: 201 })
})
