import { NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { ApiError, assertProjectAccess, oid, requireUser, route } from '@/lib/api'
import { ALLOWED_TYPES, MAX_UPLOAD_BYTES, blobEnabled } from '@/lib/blob'

/**
 * Issues short-lived upload tokens so the browser uploads straight to Vercel Blob
 * (no 4.5 MB serverless body limit). Staff only; the file must belong to a project they are on.
 */
export const POST = route(async (req) => {
  if (!blobEnabled()) throw new ApiError(400, 'File uploads need Vercel Blob. Connect a Blob store to the Vercel project (BLOB_READ_WRITE_TOKEN).')
  const me = await requireUser(req)
  const body = (await req.json()) as HandleUploadBody
  const result = await handleUpload({
    body,
    request: req,
    onBeforeGenerateToken: async (pathname, clientPayload) => {
      const { project } = JSON.parse(clientPayload || '{}')
      const pid = oid(project, 'project')
      await assertProjectAccess(me, pid)
      if (!pathname.startsWith(`projects/${pid}/`)) throw new ApiError(400, 'Invalid upload path.')
      return { allowedContentTypes: ALLOWED_TYPES, maximumSizeInBytes: MAX_UPLOAD_BYTES, addRandomSuffix: true, tokenPayload: JSON.stringify({ user: me.id, project: String(pid) }) }
    },
  })
  return NextResponse.json(result)
})
