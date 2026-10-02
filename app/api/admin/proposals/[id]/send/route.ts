import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { AccessLink, Client, Proposal } from '@/lib/models'
import { createAccessLink, emailLayout, sendEmail, siteUrl } from '@/lib/workflow'

type Ctx = { params: Promise<{ id: string }> }

/** Create the client's link to view and accept the proposal (and email it if Resend is set up). */
export const POST = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const p = await Proposal.findById(oid((await params).id))
  if (!p) throw new ApiError(404, 'Proposal not found.')
  if (p.status === 'accepted') throw new ApiError(400, 'This proposal is already accepted.')
  if (!p.items.length) throw new ApiError(400, 'Add at least one line item first.')
  const { email } = await parseBody(req, z.object({ email: z.boolean().default(false) }))
  const client = await Client.findById(p.client).lean()

  // One live link per proposal: older links stop working.
  await AccessLink.updateMany({ proposal: p._id, kind: 'proposal', revokedAt: null }, { revokedAt: new Date() })
  const days = p.validUntil ? Math.max(1, Math.ceil((p.validUntil.getTime() - Date.now()) / 864e5)) : 30
  const { token } = await createAccessLink({ kind: 'proposal', days, proposal: p._id, name: client?.contactPerson, email: client?.email, createdBy: me._id })
  const url = `${siteUrl(req)}/p/${token}`

  p.status = 'sent'
  p.sentAt = new Date()
  await p.save()

  let emailed = false
  if (email && client?.email) {
    const r = await sendEmail(client.email, `Proposal ${p.number}: ${p.title}`, emailLayout(`Your proposal from TechRover`, `<p>Hi ${client.contactPerson || client.name},</p><p>Please review our proposal <b>${p.title}</b>. You can accept it online.</p>`, { label: 'View proposal', url }))
    emailed = r.sent
  }
  await logActivity(me, 'proposal.sent', 'Proposal', p._id, `${me.name} sent proposal ${p.number} to ${client?.name ?? 'client'}`)
  return NextResponse.json({ url, emailed })
})
