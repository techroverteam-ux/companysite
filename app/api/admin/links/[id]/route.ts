import { NextResponse } from 'next/server'
import { ApiError, logActivity, oid, requireUser, route } from '@/lib/api'
import { AccessLink } from '@/lib/models'

type Ctx = { params: Promise<{ id: string }> }

/** Revoke a client link immediately. */
export const DELETE = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const link = await AccessLink.findById(oid((await params).id))
  if (!link) throw new ApiError(404, 'Link not found.')
  link.revokedAt = new Date()
  await link.save()
  await logActivity(me, 'link.revoked', 'AccessLink', link._id, `${me.name} revoked a ${link.kind} link`, link.project ?? undefined)
  return NextResponse.json({ ok: true })
})
