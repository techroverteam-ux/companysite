import { Types } from 'mongoose'
import { Client, DEFAULT_ONBOARDING, Invoice, Milestone, Project, Proposal } from '@/lib/models'
import { nextSeq, pad, totals } from '@/lib/workflow'

export function serializeProposal(p: any, clientName = '') {
  const t = totals(p.items ?? [], p.gstPercent ?? 18, p.discount ?? 0)
  return {
    id: String(p._id),
    number: p.number,
    client: String(p.client),
    clientName,
    lead: p.lead ? String(p.lead) : null,
    title: p.title,
    summary: p.summary ?? '',
    items: (p.items ?? []).map((i: any) => ({ description: i.description, quantity: i.quantity, rate: i.rate })),
    discount: p.discount ?? 0,
    gstPercent: p.gstPercent ?? 18,
    timelineWeeks: p.timelineWeeks ?? 0,
    milestones: (p.milestones ?? []).map((m: any) => ({ title: m.title, percent: m.percent, weeksFromStart: m.weeksFromStart })),
    terms: p.terms ?? '',
    validUntil: p.validUntil ?? null,
    status: p.status,
    version: p.version ?? 1,
    sentAt: p.sentAt ?? null,
    decidedAt: p.decidedAt ?? null,
    decidedByName: p.decidedByName ?? '',
    decisionNote: p.decisionNote ?? '',
    project: p.project ? String(p.project) : null,
    ...t,
    createdAt: p.createdAt,
  }
}

/**
 * Accepting a proposal turns it into real work:
 * a project (onboarding stage), its milestones, a draft advance invoice, and the client becomes "Onboarding".
 */
export async function acceptProposal(proposalId: Types.ObjectId, by: { name: string; ip?: string; note?: string; userId?: Types.ObjectId }) {
  const proposal = await Proposal.findById(proposalId)
  if (!proposal) throw new Error('Proposal not found')
  if (proposal.project) return proposal.project
  const client = await Client.findById(proposal.client)
  const { subtotal } = totals(proposal.items, proposal.gstPercent, proposal.discount)
  const start = new Date()
  const owner = by.userId ?? proposal.createdBy ?? undefined
  const project = await Project.create({
    name: proposal.title,
    client: client?.name ?? '',
    clientRef: proposal.client,
    description: proposal.summary,
    status: 'active',
    stage: 'onboarding',
    value: subtotal,
    startDate: start,
    dueDate: proposal.timelineWeeks ? new Date(start.getTime() + proposal.timelineWeeks * 7 * 864e5) : undefined,
    onboarding: DEFAULT_ONBOARDING.map((o) => ({ ...o, done: o.key === 'agreement', doneAt: o.key === 'agreement' ? new Date() : undefined })),
    proposal: proposal._id,
    createdBy: owner,
    lead: owner,
    members: owner ? [owner] : [],
  })
  const plan = proposal.milestones?.length ? proposal.milestones : [{ title: 'Project delivery', percent: 100, weeksFromStart: proposal.timelineWeeks || 0 }]
  const milestones = await Milestone.insertMany(
    plan.map((m: any, i: number) => ({
      project: project._id,
      title: m.title,
      percent: m.percent,
      order: i,
      dueDate: m.weeksFromStart ? new Date(start.getTime() + m.weeksFromStart * 7 * 864e5) : undefined,
    }))
  )
  // Draft invoice for the first milestone (the advance).
  const first = milestones[0]
  if (first && first.percent > 0) {
    const amount = Math.round((subtotal * first.percent) / 100)
    const t = totals([{ quantity: 1, rate: amount }], proposal.gstPercent, 0)
    await Invoice.create({
      number: `TR-INV-${pad(await nextSeq('invoice'))}`,
      project: project._id,
      client: proposal.client,
      milestone: first._id,
      items: [{ description: `${proposal.title} — ${first.title} (${first.percent}%)`, quantity: 1, rate: amount }],
      gstPercent: proposal.gstPercent,
      subtotal: t.subtotal,
      gstAmount: t.gstAmount,
      total: t.total,
      status: 'draft',
      dueDate: new Date(Date.now() + 7 * 864e5),
      createdBy: proposal.createdBy,
    })
  }
  proposal.status = 'accepted'
  proposal.decidedAt = new Date()
  proposal.decidedByName = by.name
  proposal.decisionNote = by.note ?? ''
  proposal.decidedIp = by.ip
  proposal.project = project._id
  await proposal.save()
  if (client && (client.accountStatus === 'Lead' || client.accountStatus === 'Past Client')) {
    client.accountStatus = 'Onboarding'
    await client.save()
  }
  return project._id
}
