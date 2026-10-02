import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { REVIEW_STATUSES, Review } from '@/lib/models'
import { serializeReview } from '@/lib/reviews'

type Ctx = { params: Promise<{ id: string }> }

const schema = z.object({
  status: z.enum(REVIEW_STATUSES).optional(),
  text: z.string().trim().max(3000).optional(),
  name: z.string().trim().min(2).max(120).optional(),
  role: z.string().max(120).optional(),
  company: z.string().max(140).optional(),
})

export const PATCH = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const r = await Review.findById(oid((await params).id))
  if (!r) throw new ApiError(404, 'Review not found.')
  const input = await parseBody(req, schema)
  if (input.status === 'published' && !r.consent) throw new ApiError(400, 'The client did not agree to publish this review.')
  Object.assign(r, input)
  if (input.status === 'published') {
    r.publishedAt = new Date()
    r.approvedBy = me._id
  }
  await r.save()
  await logActivity(me, 'review.updated', 'Review', r._id, `${me.name} set review from ${r.name} to ${r.status}`)
  return NextResponse.json({ review: serializeReview(r.toObject()) })
})

export const DELETE = route<Ctx>(async (req, { params }) => {
  await requireUser(req, ['owner'])
  const r = await Review.findById(oid((await params).id))
  if (!r) throw new ApiError(404, 'Review not found.')
  await r.deleteOne()
  return NextResponse.json({ ok: true })
})
