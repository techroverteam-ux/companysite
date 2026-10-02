import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, isManager, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { Leave, User } from '@/lib/models'
import { notify } from '@/lib/workflow'

type Ctx = { params: Promise<{ id: string }> }

const schema = z.object({ status: z.enum(['approved', 'rejected', 'cancelled']), note: z.string().max(1000).default('') })

/** Managers approve or reject; the requester can cancel. */
export const PATCH = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req)
  const leave = await Leave.findById(oid((await params).id))
  if (!leave) throw new ApiError(404, 'Leave request not found.')
  const { status, note } = await parseBody(req, schema)
  const own = String(leave.user) === me.id

  if (status === 'cancelled') {
    if (!own && !isManager(me)) throw new ApiError(403, 'You can only cancel your own leave.')
  } else {
    if (!isManager(me)) throw new ApiError(403, 'Only a manager can approve or reject leave.')
    if (own && me.role !== 'owner') throw new ApiError(403, 'Ask another manager or the owner to approve your own leave.')
  }
  if (leave.status !== 'pending' && !(status === 'cancelled' && leave.status === 'approved')) {
    throw new ApiError(400, `This request is already ${leave.status}.`)
  }

  leave.status = status
  leave.decidedBy = me._id
  leave.decidedAt = new Date()
  leave.decisionNote = note
  await leave.save()

  if (!own) {
    await notify([String(leave.user)], { title: `Your leave ${leave.from}${leave.to !== leave.from ? `–${leave.to}` : ''} was ${status}`, body: note, tab: 'attendance' }, { email: true })
  }
  const who = await User.findById(leave.user, { name: 1 }).lean()
  await logActivity(me, `leave.${status}`, 'Leave', leave._id, `${me.name} ${status} leave for ${who?.name ?? 'a team member'}`)
  return NextResponse.json({ ok: true })
})
