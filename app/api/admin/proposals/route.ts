import { NextResponse } from 'next/server'
import { ApiError, logActivity, parseBody, requireUser, route } from '@/lib/api'
import { Client, Proposal } from '@/lib/models'
import { proposalInput } from '@/lib/schemas'
import { serializeProposal } from '@/lib/proposals'
import { nextSeq, pad } from '@/lib/workflow'

export const GET = route(async (req) => {
  await requireUser(req, ['owner', 'manager'])
  const filter: Record<string, unknown> = {}
  const client = req.nextUrl.searchParams.get('client')
  if (client) filter.client = client
  const list = await Proposal.find(filter).sort({ createdAt: -1 }).limit(500).lean()
  const clients = new Map((await Client.find({ _id: { $in: list.map((p) => p.client) } }, { name: 1 }).lean()).map((c) => [String(c._id), c.name]))
  // Expire old sent proposals on read.
  const now = new Date()
  return NextResponse.json({
    proposals: list.map((p) => {
      const s = serializeProposal(p, clients.get(String(p.client)) ?? '')
      if (s.status === 'sent' && p.validUntil && p.validUntil < now) s.status = 'expired'
      return s
    }),
  })
})

export const POST = route(async (req) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const input = await parseBody(req, proposalInput)
  if (!(await Client.exists({ _id: input.client }))) throw new ApiError(400, 'Choose a client.')
  const p = await Proposal.create({
    ...input,
    lead: input.lead || undefined,
    validUntil: input.validUntil ? new Date(`${input.validUntil}T23:59:59+05:30`) : new Date(Date.now() + 30 * 864e5),
    number: `TR-Q-${pad(await nextSeq('proposal'))}`,
    createdBy: me._id,
  })
  await logActivity(me, 'proposal.created', 'Proposal', p._id, `${me.name} drafted proposal ${p.number} “${p.title}”`)
  return NextResponse.json({ proposal: serializeProposal(p.toObject()) }, { status: 201 })
})
