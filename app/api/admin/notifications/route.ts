import { NextResponse } from 'next/server'
import { z } from 'zod'
import { parseBody, requireUser, route, zId } from '@/lib/api'
import { Notification } from '@/lib/models'

export const GET = route(async (req) => {
  const me = await requireUser(req)
  const [items, unread] = await Promise.all([
    Notification.find({ user: me._id }).sort({ createdAt: -1 }).limit(40).lean(),
    Notification.countDocuments({ user: me._id, read: false }),
  ])
  return NextResponse.json({
    unread,
    notifications: items.map((n) => ({
      id: String(n._id),
      title: n.title,
      body: n.body,
      tab: n.tab,
      task: n.task ? String(n.task) : null,
      project: n.project ? String(n.project) : null,
      read: n.read,
      createdAt: n.createdAt,
    })),
  })
})

const schema = z.object({ ids: z.array(zId).max(100).optional(), all: z.boolean().optional() })

/** Mark notifications as read. */
export const POST = route(async (req) => {
  const me = await requireUser(req)
  const { ids, all } = await parseBody(req, schema)
  const filter = all ? { user: me._id } : { user: me._id, _id: { $in: ids ?? [] } }
  await Notification.updateMany(filter, { read: true })
  return NextResponse.json({ ok: true })
})
