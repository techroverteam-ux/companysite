import { NextResponse } from 'next/server'
import { z } from 'zod'
import { assertProjectAccess, isManager, ApiError, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { ProjectFile } from '@/lib/models'
import { projectFiles, serializeFile } from '@/lib/delivery'
import { isBlobUrl } from '@/lib/blob'

type Ctx = { params: Promise<{ id: string }> }

export const GET = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req)
  const id = oid((await params).id)
  await assertProjectAccess(me, id)
  return NextResponse.json({ files: await projectFiles(id) })
})

const schema = z.object({
  title: z.string().trim().min(1).max(200),
  url: z.string().url().max(2000),
  kind: z.enum(['brief', 'design', 'build', 'document', 'other']).default('document'),
  visibleToClient: z.boolean().default(false),
  stored: z.boolean().default(false), // true = uploaded to Vercel Blob
  size: z.coerce.number().min(0).default(0),
  contentType: z.string().max(200).default(''),
})

/** Files are links (Google Drive, Figma, a build URL…). Only managers can share a file with the client. */
export const POST = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req)
  const id = oid((await params).id)
  await assertProjectAccess(me, id)
  const input = await parseBody(req, schema)
  if (input.visibleToClient && !isManager(me)) throw new ApiError(403, 'Only a manager can share files with the client.')
  if (input.stored && !isBlobUrl(input.url)) throw new ApiError(400, 'Uploaded files must come from the Blob store.')
  const f = await ProjectFile.create({ ...input, project: id, addedBy: me._id })
  await logActivity(me, 'file.added', 'ProjectFile', f._id, `${me.name} added file “${f.title}”`, id)
  return NextResponse.json({ file: serializeFile(f.toObject()) }, { status: 201 })
})
