import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, logActivity, oid, parseBody, requireUser, route, zId } from '@/lib/api'
import { LEAD_STATUSES, Lead } from '@/lib/models'

type Ctx = { params: Promise<{ id: string }> }

const schema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  owner: zId.nullable().optional(),
  notes: z.string().max(5000).optional(),
})

export const PATCH = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const lead = await Lead.findById(oid((await params).id))
  if (!lead) throw new ApiError(404, 'Lead not found.')
  const input = await parseBody(req, schema)
  if (input.status) lead.status = input.status
  if (input.owner !== undefined) lead.set('owner', input.owner || undefined)
  if (input.notes !== undefined) lead.notes = input.notes
  await lead.save()
  await logActivity(me, 'lead.updated', 'Lead', lead._id, `${me.name} updated lead ${lead.name || lead.email}${input.status ? ` → ${input.status}` : ''}`)
  return NextResponse.json({ ok: true })
})

export const DELETE = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner'])
  const lead = await Lead.findById(oid((await params).id))
  if (!lead) throw new ApiError(404, 'Lead not found.')
  await lead.deleteOne()
  await logActivity(me, 'lead.deleted', 'Lead', lead._id, `${me.name} deleted lead ${lead.name || lead.email}`)
  return NextResponse.json({ ok: true })
})
