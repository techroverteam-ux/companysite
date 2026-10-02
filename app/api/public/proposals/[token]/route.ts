import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, clientIp, parseBody, rateLimit, route } from '@/lib/api'
import { Client, Proposal } from '@/lib/models'
import { acceptProposal, serializeProposal } from '@/lib/proposals'
import { findAccessLink, managerIds, notify } from '@/lib/workflow'

type Ctx = { params: Promise<{ token: string }> }

async function load(token: string) {
  const link = await findAccessLink(token, 'proposal')
  if (!link?.proposal) throw new ApiError(404, 'This link is not valid any more. Please ask TechRover for a new one.')
  const p = await Proposal.findById(link.proposal)
  if (!p) throw new ApiError(404, 'Proposal not found.')
  return { link, p }
}

export const GET = route<Ctx>(async (req, { params }) => {
  rateLimit(`pub:${clientIp(req)}`, 60, 60_000)
  const { link, p } = await load((await params).token)
  link.lastSeenAt = new Date()
  await link.save()
  const client = await Client.findById(p.client, { name: 1, contactPerson: 1 }).lean()
  const s = serializeProposal(p.toObject(), client?.name ?? '')
  const expired = s.status === 'sent' && !!p.validUntil && p.validUntil < new Date()
  // Only what the client needs to see.
  return NextResponse.json({
    proposal: {
      number: s.number, title: s.title, summary: s.summary, items: s.items, discount: s.discount, gstPercent: s.gstPercent,
      gross: s.gross, subtotal: s.subtotal, gstAmount: s.gstAmount, total: s.total, timelineWeeks: s.timelineWeeks,
      milestones: s.milestones, terms: s.terms, validUntil: s.validUntil, status: expired ? 'expired' : s.status, version: s.version,
      decidedAt: s.decidedAt, decidedByName: s.decidedByName, clientName: s.clientName, contactName: client?.contactPerson ?? '',
    },
    company: { name: process.env.COMPANY_NAME || 'TechRover', email: process.env.COMPANY_EMAIL || '' },
  })
})

const schema = z.object({
  decision: z.enum(['accept', 'reject']),
  name: z.string().trim().min(2, 'Please type your full name.').max(120),
  note: z.string().max(2000).default(''),
  agree: z.boolean().optional(),
})

export const POST = route<Ctx>(async (req, { params }) => {
  const ip = clientIp(req)
  rateLimit(`pub-post:${ip}`, 10, 60_000)
  const { link, p } = await load((await params).token)
  const input = await parseBody(req, schema)
  if (p.status === 'accepted' || p.status === 'rejected') throw new ApiError(409, `This proposal was already ${p.status}.`)
  if (p.status !== 'sent') throw new ApiError(400, 'This proposal is being updated. Please wait for the new version.')
  if (p.validUntil && p.validUntil < new Date()) throw new ApiError(400, 'This proposal has expired. Please ask for an updated one.')

  if (input.decision === 'accept') {
    if (!input.agree) throw new ApiError(400, 'Please tick the box to accept the scope and terms.')
    await acceptProposal(p._id, { name: input.name, note: input.note, ip })
  } else {
    p.status = 'rejected'
    p.decidedAt = new Date()
    p.decidedByName = input.name
    p.decisionNote = input.note
    p.decidedIp = ip
    await p.save()
  }
  link.usedAt = new Date()
  await link.save()
  await notify(await managerIds(), { title: `Proposal ${p.number} ${input.decision === 'accept' ? 'ACCEPTED' : 'declined'} by ${input.name}`, body: input.note || p.title, tab: input.decision === 'accept' ? 'projects' : 'proposals' }, { email: true })
  return NextResponse.json({ ok: true, status: input.decision === 'accept' ? 'accepted' : 'rejected' })
})
