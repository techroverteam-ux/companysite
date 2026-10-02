import { NextResponse } from 'next/server'
import { z } from 'zod'
import { logActivity, parseBody, requireUser, route } from '@/lib/api'
import { Client, Project } from '@/lib/models'
import { isObjectId, listClients, splitClient } from '@/lib/clients'

export const GET = route(async (req) => {
  await requireUser(req, ['owner', 'manager'])
  return NextResponse.json({ clients: await listClients() })
})

/** Create one client. */
export const POST = route(async (req) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const body = await parseBody(req, z.record(z.string(), z.any()))
  const { known, extra } = splitClient(body)
  const client = await Client.create({ ...known, extra })
  await logActivity(me, 'client.created', 'Client', client._id, `${me.name} added client ${client.name}`)
  return NextResponse.json({ id: String(client._id) }, { status: 201 })
})

/**
 * Save the whole list from the Client Management screen:
 * updates existing clients, creates new ones, removes ones deleted on screen.
 */
export const PUT = route(async (req) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const list = await parseBody(req, z.object({ clients: z.array(z.record(z.string(), z.any())).max(2000) }))
  const keep: string[] = []
  for (const c of list.clients) {
    const { known, extra } = splitClient(c)
    if (isObjectId(c.id) && (await Client.exists({ _id: c.id }))) {
      await Client.updateOne({ _id: c.id }, { $set: { ...known, extra } })
      keep.push(String(c.id))
    } else {
      const existing = c.id ? await Client.findOne({ legacyId: String(c.id) }, { _id: 1 }).lean() : null
      if (existing) {
        await Client.updateOne({ _id: existing._id }, { $set: { ...known, extra } })
        keep.push(String(existing._id))
      } else {
        const created = await Client.create({ ...known, extra, legacyId: c.id ? String(c.id) : undefined })
        keep.push(String(created._id))
      }
    }
  }
  // Clients that have projects are never removed from here (their history stays linked).
  const referenced = (await Project.distinct('clientRef')).filter(Boolean).map(String)
  const removed = await Client.deleteMany({ _id: { $nin: [...keep, ...referenced] } })
  await logActivity(me, 'client.saved', 'Client', undefined, `${me.name} updated the client list${removed.deletedCount ? ` (removed ${removed.deletedCount})` : ''}`)
  return NextResponse.json({ clients: await listClients() })
})
