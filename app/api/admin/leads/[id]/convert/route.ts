import { NextResponse } from 'next/server'
import { ApiError, logActivity, oid, requireUser, route } from '@/lib/api'
import { Client, Lead } from '@/lib/models'

type Ctx = { params: Promise<{ id: string }> }

/** Turn a lead into a client account (or link it to the existing client with the same email). */
export const POST = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const lead = await Lead.findById(oid((await params).id))
  if (!lead) throw new ApiError(404, 'Lead not found.')
  if (lead.client) return NextResponse.json({ clientId: String(lead.client), existing: true })

  let client = lead.email ? await Client.findOne({ email: lead.email }) : null
  if (!client) {
    client = await Client.create({
      name: lead.company || lead.name || lead.email,
      contactPerson: lead.name,
      email: lead.email,
      phone: lead.phone,
      accountStatus: 'Lead',
      description: lead.message?.slice(0, 1000) ?? '',
      services: lead.details?.service ? [String(lead.details.service)] : [],
      lead: lead._id,
    })
  }
  lead.client = client._id
  if (lead.status === 'new' || lead.status === 'contacted') lead.status = 'qualified'
  await lead.save()
  await logActivity(me, 'lead.converted', 'Lead', lead._id, `${me.name} converted lead ${lead.name || lead.email} into client ${client.name}`)
  return NextResponse.json({ clientId: String(client._id), existing: false })
})
