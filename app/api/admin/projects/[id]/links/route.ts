import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { AccessLink, Client, Project } from '@/lib/models'
import { createAccessLink, emailLayout, sendEmail, siteUrl } from '@/lib/workflow'

type Ctx = { params: Promise<{ id: string }> }

/** Links shared with this project's client (tokens are never shown again after creation). */
export const GET = route<Ctx>(async (req, { params }) => {
  await requireUser(req, ['owner', 'manager'])
  const links = await AccessLink.find({ project: oid((await params).id) }).sort({ createdAt: -1 }).lean()
  const now = new Date()
  return NextResponse.json({
    links: links.map((l) => ({
      id: String(l._id),
      kind: l.kind,
      name: l.name,
      email: l.email,
      createdAt: l.createdAt,
      expiresAt: l.expiresAt,
      lastSeenAt: l.lastSeenAt ?? null,
      usedAt: l.usedAt ?? null,
      state: l.revokedAt ? 'revoked' : l.usedAt && l.kind === 'review' ? 'used' : l.expiresAt < now ? 'expired' : 'active',
    })),
  })
})

const schema = z.object({
  kind: z.enum(['portal', 'review']),
  name: z.string().trim().max(120).default(''),
  email: z.union([z.string().trim().toLowerCase().email(), z.literal('')]).default(''),
  sendEmail: z.boolean().default(false),
})

/** Portal links last 180 days; review links 14 days and work once. */
export const POST = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const id = oid((await params).id)
  const project = await Project.findById(id).lean()
  if (!project) throw new ApiError(404, 'Project not found.')
  const input = await parseBody(req, schema)
  const client = project.clientRef ? await Client.findById(project.clientRef).lean() : null
  const name = input.name || client?.contactPerson || ''
  const email = input.email || client?.email || ''
  if (input.kind === 'review' && (await AccessLink.exists({ project: id, kind: 'review', email, usedAt: null, revokedAt: null, expiresAt: { $gt: new Date() } })) && email) {
    throw new ApiError(409, 'This person already has an unused review link. Revoke it first to send a new one.')
  }
  const { token, link } = await createAccessLink({ kind: input.kind, days: input.kind === 'portal' ? 180 : 14, project: id, name, email, createdBy: me._id })
  const url = `${siteUrl(req)}/${input.kind === 'portal' ? 'portal' : 'review'}/${token}`
  let emailed = false
  if (input.sendEmail && email) {
    const r =
      input.kind === 'portal'
        ? await sendEmail(email, `Your project portal: ${project.name}`, emailLayout(`Track ${project.name}`, `<p>Hi ${name || 'there'},</p><p>Use this private link to follow progress, approve milestones, request changes and see invoices.</p>`, { label: 'Open project portal', url }))
        : await sendEmail(email, `How did we do on ${project.name}?`, emailLayout(`Would you review TechRover?`, `<p>Hi ${name || 'there'},</p><p>It takes 2 minutes and helps us a lot. The link works once and expires in 14 days.</p>`, { label: 'Leave a review', url }))
    emailed = r.sent
  }
  await logActivity(me, `link.${input.kind}`, 'AccessLink', link._id, `${me.name} created a ${input.kind} link for ${name || email || project.name}`, id)
  return NextResponse.json({ url, emailed, id: String(link._id) }, { status: 201 })
})
