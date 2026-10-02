import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import { ApiError, requireUser, route } from '@/lib/api'

/**
 * Website content files in /data.
 * Only names on these lists can be read or written — nothing else in /data is reachable.
 * Form submissions (contact, meetings, hire-team, collaboration) now live in MongoDB, not here.
 */
const PUBLIC_CONTENT = new Set([
  'services',
  'portfolio',
  'reviews',
  'team',
  'case-studies',
  'home',
  'about',
  'products',
  'ai-agents',
  'marketing',
])
const PRIVATE_CONTENT = new Set(['clients'])

type Ctx = { params: Promise<{ type: string }> }

function fileFor(type: string) {
  return join(process.cwd(), 'data', `${type}.json`)
}

export const GET = route<Ctx>(async (req: NextRequest, { params }) => {
  const { type } = await params
  if (PRIVATE_CONTENT.has(type)) await requireUser(req, ['owner', 'manager'])
  else if (!PUBLIC_CONTENT.has(type)) throw new ApiError(404, 'Not found.')
  const data = await readFile(fileFor(type), 'utf8')
  return NextResponse.json(JSON.parse(data))
})

export const PUT = route<Ctx>(async (req: NextRequest, { params }) => {
  await requireUser(req, ['owner', 'manager'])
  const { type } = await params
  if (!PUBLIC_CONTENT.has(type) && !PRIVATE_CONTENT.has(type)) throw new ApiError(404, 'Not found.')
  const body = await req.json().catch(() => null)
  if (!body || body.data === undefined || typeof body.data === 'string') {
    throw new ApiError(400, 'Send the content as { "data": <json> }.')
  }
  try {
    await writeFile(fileFor(type), JSON.stringify(body.data, null, 2))
  } catch (err) {
    console.error('[data] write failed', err)
    throw new ApiError(
      503,
      'Saving website content is not available on this server (its files are read-only). Edit the JSON in the repo, or move this content to the database.'
    )
  }
  return NextResponse.json({ success: true })
})
