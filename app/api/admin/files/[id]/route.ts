import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, assertProjectAccess, isManager, oid, parseBody, requireUser, route } from '@/lib/api'
import { ProjectFile } from '@/lib/models'
import { deleteBlob } from '@/lib/blob'

type Ctx = { params: Promise<{ id: string }> }

export const PATCH = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const f = await ProjectFile.findById(oid((await params).id))
  if (!f) throw new ApiError(404, 'File not found.')
  const { visibleToClient } = await parseBody(req, z.object({ visibleToClient: z.boolean() }))
  f.visibleToClient = visibleToClient
  await f.save()
  return NextResponse.json({ ok: true })
})

export const DELETE = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req)
  const f = await ProjectFile.findById(oid((await params).id))
  if (!f) throw new ApiError(404, 'File not found.')
  await assertProjectAccess(me, f.project)
  if (!isManager(me) && String(f.addedBy) !== me.id) throw new ApiError(403, 'Only a manager or the person who added it can remove it.')
  if (f.stored) await deleteBlob(f.url)
  await f.deleteOne()
  return NextResponse.json({ ok: true })
})
