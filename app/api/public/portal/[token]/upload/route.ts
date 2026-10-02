import { NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { ApiError, clientIp, rateLimit, route } from '@/lib/api'
import { ALLOWED_TYPES, MAX_UPLOAD_BYTES, blobEnabled } from '@/lib/blob'
import { findAccessLink } from '@/lib/workflow'

type Ctx = { params: Promise<{ token: string }> }

/** Lets a client upload brand assets / content from their portal link straight to Vercel Blob. */
export const POST = route<Ctx>(async (req, { params }) => {
  rateLimit(`pub-upload:${clientIp(req)}`, 30, 60_000)
  if (!blobEnabled()) throw new ApiError(400, 'Uploads are not available right now. Please email the files to us.')
  const link = await findAccessLink((await params).token, 'portal')
  if (!link?.project) throw new ApiError(404, 'This link is not valid any more.')
  const body = (await req.json()) as HandleUploadBody
  const result = await handleUpload({
    body,
    request: req,
    onBeforeGenerateToken: async (pathname) => {
      if (!pathname.startsWith(`projects/${link.project}/client/`)) throw new ApiError(400, 'Invalid upload path.')
      return { allowedContentTypes: ALLOWED_TYPES, maximumSizeInBytes: MAX_UPLOAD_BYTES, addRandomSuffix: true }
    },
  })
  return NextResponse.json(result)
})
