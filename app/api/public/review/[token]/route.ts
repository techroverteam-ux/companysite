import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, clientIp, parseBody, rateLimit, route } from '@/lib/api'
import { Client, Project, Review, User } from '@/lib/models'
import { findAccessLink, managerIds, notify } from '@/lib/workflow'

type Ctx = { params: Promise<{ token: string }> }

async function load(token: string) {
  const link = await findAccessLink(token, 'review')
  if (!link || link.usedAt) throw new ApiError(404, 'This review link has already been used or has expired. Thank you!')
  const project = link.project ? await Project.findById(link.project, { name: 1, clientRef: 1, client: 1 }).lean() : null
  const client = project?.clientRef ? await Client.findById(project.clientRef, { name: 1 }).lean() : null
  return { link, project, client }
}

export const GET = route<Ctx>(async (req, { params }) => {
  rateLimit(`pub:${clientIp(req)}`, 60, 60_000)
  const { link, project, client } = await load((await params).token)
  return NextResponse.json({ name: link.name, project: project?.name ?? '', company: client?.name ?? project?.client ?? '', googleReviewUrl: process.env.GOOGLE_REVIEW_URL || '' })
})

const schema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().max(120).default(''),
  company: z.string().trim().max(140).default(''),
  whatWeBuilt: z.string().trim().max(300).default(''),
  text: z.string().trim().max(3000).default(''),
  improve: z.string().trim().max(3000).default(''),
  consent: z.boolean().default(false),
})

export const POST = route<Ctx>(async (req, { params }) => {
  rateLimit(`pub-post:${clientIp(req)}`, 10, 60_000)
  const { link, project } = await load((await params).token)
  const input = await parseBody(req, schema)
  if (input.rating >= 4 && input.text.length < 10) throw new ApiError(400, 'Please tell us a little about what went well.')
  // 3 stars or lower goes privately to the owner as feedback, never to the public queue.
  const isPrivate = input.rating <= 3
  const review = await Review.create({
    ...input,
    project: project?._id,
    client: project?.clientRef,
    verified: true,
    status: isPrivate ? 'private' : 'pending',
    consent: isPrivate ? false : input.consent,
  })
  link.usedAt = new Date()
  await link.save()
  const owners = (await User.find({ role: 'owner', active: true }, { _id: 1 }).lean()).map((u) => String(u._id))
  await notify(isPrivate ? owners : await managerIds(), {
    title: isPrivate ? `Private feedback (${input.rating}★) from ${input.name}` : `New ${input.rating}★ review from ${input.name} — approve to publish`,
    body: (isPrivate ? input.improve || input.text : input.text).slice(0, 200),
    tab: 'reviews',
  }, { email: true })
  return NextResponse.json({ ok: true, id: String(review._id), askGoogle: !isPrivate && !!process.env.GOOGLE_REVIEW_URL, googleReviewUrl: process.env.GOOGLE_REVIEW_URL || '' })
})
