import { NextResponse } from 'next/server'
import { z } from 'zod'
import { logActivity, parseBody, requireUser, route, zId } from '@/lib/api'
import { Project, REVIEW_STATUSES, Review } from '@/lib/models'
import { serializeReview } from '@/lib/reviews'

export const GET = route(async (req) => {
  await requireUser(req, ['owner', 'manager'])
  const status = req.nextUrl.searchParams.get('status')
  const filter: Record<string, unknown> = status && (REVIEW_STATUSES as readonly string[]).includes(status) ? { status } : {}
  const list = await Review.find(filter).sort({ createdAt: -1 }).limit(500).lean()
  const projects = new Map((await Project.find({ _id: { $in: list.map((r) => r.project).filter(Boolean) } }, { name: 1 }).lean()).map((p) => [String(p._id), p.name]))
  return NextResponse.json({ reviews: list.map((r) => serializeReview(r, r.project ? projects.get(String(r.project)) ?? '' : '')) })
})

const schema = z.object({
  project: zId.nullable().optional(),
  name: z.string().trim().min(2).max(120),
  role: z.string().max(120).default(''),
  company: z.string().max(140).default(''),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().trim().min(10).max(3000),
  whatWeBuilt: z.string().max(300).default(''),
  consent: z.boolean().default(true),
})

/** Add a review you received elsewhere (email, WhatsApp, Google). Not marked "verified". */
export const POST = route(async (req) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const input = await parseBody(req, schema)
  const r = await Review.create({ ...input, project: input.project || undefined, status: 'pending', verified: false })
  await logActivity(me, 'review.added', 'Review', r._id, `${me.name} added a review from ${r.name}`)
  return NextResponse.json({ review: serializeReview(r.toObject()) }, { status: 201 })
})
