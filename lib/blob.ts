/**
 * Vercel Blob storage for uploaded files (project files, client brand assets).
 * Needs BLOB_READ_WRITE_TOKEN (added automatically when a Blob store is connected to the Vercel project;
 * run `vercel env pull` to get it locally).
 * Files are stored with a random suffix so their URLs cannot be guessed.
 */
import { del } from '@vercel/blob'

export const blobEnabled = () => !!process.env.BLOB_READ_WRITE_TOKEN
export const MAX_UPLOAD_BYTES = Number(process.env.BLOB_MAX_MB || 50) * 1024 * 1024

export const ALLOWED_TYPES = [
  'image/*',
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'video/mp4',
  'application/json',
  'application/octet-stream',
]

/** Only URLs from our own Blob store are accepted as "uploaded" files. */
export const isBlobUrl = (url: string) => {
  try {
    return new URL(url).hostname.endsWith('.blob.vercel-storage.com')
  } catch {
    return false
  }
}

export const safeName = (name: string) => name.replace(/[^\w.\-]+/g, '-').replace(/-+/g, '-').slice(-120) || 'file'

export async function deleteBlob(url: string) {
  if (!blobEnabled() || !isBlobUrl(url)) return
  try {
    await del(url)
  } catch (err) {
    console.error('[blob] delete failed', err)
  }
}
