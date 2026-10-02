import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, clientIp, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { AccessLink, Client, Proposal } from '@/lib/models'
import { proposalPatch } from '@/lib/schemas'
import { acceptProposal, serializeProposal } from '@/lib/proposals'

type Ctx = { params: Promise<{ id: string }> }

async function load(id: string) {
  const p = await Proposal.findById(oid(id))
  if (!p) throw new ApiError(404, 'Proposal not found.')
  return p
}

export const GET = route<Ctx>(async (req, { params }) => {
  await requireUser(req, ['owner', 'manager'])
  const p = await load((await params).id)
  const client = await Client.findById(p.client, { name: 1 }).lean()
  return NextResponse.json({ proposal: serializeProposal(p.toObject(), client?.name ?? '') })
})

export const PATCH = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const p = await load((await params).id)
  if (p.status === 'accepted') throw new ApiError(400, 'An accepted proposal cannot be edited. Use a change request on the project.')
  const input = await parseBody(req, proposalPatch)
  const { validUntil, lead, ...rest } = input
  Object.assign(p, rest)
  if (lead !== undefined) p.set('lead', lead || undefined)
  if (validUntil !== undefined) p.set('validUntil', validUntil ? new Date(`${validUntil}T23:59:59+05:30`) : undefined)
  if (p.status === 'sent' || p.status === 'rejected' || p.status === 'expired') {
    p.version = (p.version ?? 1) + 1 // client sees the new version on the same link
    if (p.status !== 'sent') p.status = 'draft'
  }
  await p.save()
  await logActivity(me, 'proposal.updated', 'Proposal', p._id, `${me.name} updated proposal ${p.number}`)
  return NextResponse.json({ proposal: serializeProposal(p.toObject()) })
})

/** Mark accepted on the client's behalf (e.g. signed on paper or over email). */
export const POST = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const p = await load((await params).id)
  const { action, name, note } = await parseBody(req, z.object({ action: z.enum(['accept', 'reject']), name: z.string().max(120).default(''), note: z.string().max(2000).default('') }))
  if (p.status === 'accepted') throw new ApiError(400, 'Already accepted.')
  if (action === 'accept') {
    const projectId = await acceptProposal(p._id, { name: name || `${me.name} (on behalf of client)`, note, ip: clientIp(req), userId: me._id })
    await AccessLink.updateMany({ proposal: p._id, kind: 'proposal' }, { usedAt: new Date() })
    await logActivity(me, 'proposal.accepted', 'Proposal', p._id, `${me.name} marked ${p.number} accepted — project created`, projectId)
    return NextResponse.json({ project: String(projectId) })
  }
  p.status = 'rejected'
  p.decidedAt = new Date()
  p.decidedByName = name || me.name
  p.decisionNote = note
  await p.save()
  return NextResponse.json({ ok: true })
})

export const DELETE = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const p = await load((await params).id)
  if (p.status === 'accepted') throw new ApiError(400, 'Accepted proposals are kept as a record.')
  await AccessLink.deleteMany({ proposal: p._id })
  await p.deleteOne()
  await logActivity(me, 'proposal.deleted', 'Proposal', p._id, `${me.name} deleted proposal ${p.number}`)
  return NextResponse.json({ ok: true })
})
