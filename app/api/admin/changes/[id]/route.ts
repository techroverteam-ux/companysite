import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { CHANGE_STATUSES, ChangeRequest } from '@/lib/models'
import { changeToTask, serializeChange } from '@/lib/delivery'

type Ctx = { params: Promise<{ id: string }> }

const schema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  description: z.string().max(5000).optional(),
  estimateHours: z.coerce.number().min(0).max(10000).optional(),
  cost: z.coerce.number().min(0).max(1e9).optional(),
  daysAdded: z.coerce.number().min(0).max(1000).optional(),
  status: z.enum(CHANGE_STATUSES).optional(),
})

/** Estimate, approve (on the client's behalf), reject or close a change request. Approval creates a task. */
export const PATCH = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const cr = await ChangeRequest.findById(oid((await params).id))
  if (!cr) throw new ApiError(404, 'Change request not found.')
  const input = await parseBody(req, schema)
  Object.assign(cr, input)
  if (!input.status && (input.estimateHours !== undefined || input.cost !== undefined) && cr.status === 'submitted') cr.status = 'estimated'
  if (input.status === 'approved' || input.status === 'rejected') {
    cr.decidedAt = new Date()
    cr.decidedBy = `${me.name} (staff)`
  }
  await cr.save()
  if (cr.status === 'approved') await changeToTask(cr._id, me._id)
  await logActivity(me, 'change.updated', 'ChangeRequest', cr._id, `${me.name} set change “${cr.title}” to ${cr.status}`, cr.project)
  const fresh = await ChangeRequest.findById(cr._id).lean()
  return NextResponse.json({ change: serializeChange(fresh) })
})

export const DELETE = route<Ctx>(async (req, { params }) => {
  await requireUser(req, ['owner', 'manager'])
  const cr = await ChangeRequest.findById(oid((await params).id))
  if (!cr) throw new ApiError(404, 'Change request not found.')
  if (cr.task) throw new ApiError(409, 'This change already has a task. Close it instead.')
  await cr.deleteOne()
  return NextResponse.json({ ok: true })
})
