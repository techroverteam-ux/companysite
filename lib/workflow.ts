import { createHash, randomBytes } from 'crypto'
import type { NextRequest } from 'next/server'
import { Types } from 'mongoose'
import { AccessLink, Counter, Notification, User } from '@/lib/models'

/* ------------------------------------------------------------------ */
/* Sequences: TR-12, TR-Q-0004, TR-INV-0009                            */
/* ------------------------------------------------------------------ */
export async function nextSeq(name: string): Promise<number> {
  const doc = await Counter.findOneAndUpdate({ _id: name }, { $inc: { seq: 1 } }, { upsert: true, new: true }).lean()
  return doc!.seq
}
export const pad = (n: number, w = 4) => String(n).padStart(w, '0')

/* ------------------------------------------------------------------ */
/* Secure client links                                                 */
/* ------------------------------------------------------------------ */
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

export async function createAccessLink(opts: {
  kind: 'portal' | 'proposal' | 'review'
  days: number
  project?: Types.ObjectId | string
  proposal?: Types.ObjectId | string
  name?: string
  email?: string
  createdBy?: Types.ObjectId
}) {
  const token = randomBytes(32).toString('base64url')
  const link = await AccessLink.create({
    kind: opts.kind,
    tokenHash: hashToken(token),
    project: opts.project,
    proposal: opts.proposal,
    name: opts.name ?? '',
    email: opts.email ?? '',
    expiresAt: new Date(Date.now() + opts.days * 864e5),
    createdBy: opts.createdBy,
  })
  return { token, link }
}

/** Finds a valid (not expired / revoked / used) link for a token. */
export async function findAccessLink(token: string, kind: 'portal' | 'proposal' | 'review') {
  if (!token || token.length < 20 || token.length > 100) return null
  const link = await AccessLink.findOne({ tokenHash: hashToken(token), kind })
  if (!link || link.revokedAt || link.expiresAt < new Date()) return null
  return link
}

export function siteUrl(req: NextRequest) {
  return (process.env.SITE_URL || req.nextUrl.origin).replace(/\/$/, '')
}

/* ------------------------------------------------------------------ */
/* Money                                                               */
/* ------------------------------------------------------------------ */
export function totals(items: { quantity: number; rate: number }[], gstPercent: number, discount = 0) {
  const gross = items.reduce((s, i) => s + (i.quantity || 0) * (i.rate || 0), 0)
  const subtotal = Math.max(0, Math.round((gross - discount) * 100) / 100)
  const gstAmount = Math.round(subtotal * gstPercent) / 100
  return { gross, subtotal, gstAmount, total: Math.round((subtotal + gstAmount) * 100) / 100 }
}

/** Today's date in India (YYYY-MM-DD). */
export const todayIST = () => new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10)

/* ------------------------------------------------------------------ */
/* Notifications (in-app, plus email when Resend is configured)        */
/* ------------------------------------------------------------------ */
export async function sendEmail(to: string | string[], subject: string, html: string) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  const list = (Array.isArray(to) ? to : [to]).filter(Boolean)
  if (!key || !from || !list.length) return { sent: false }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: list, subject, html }),
    })
    if (!res.ok) console.error('[email]', res.status, await res.text().catch(() => ''))
    return { sent: res.ok }
  } catch (err) {
    console.error('[email]', err)
    return { sent: false }
  }
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

export function emailLayout(title: string, body: string, cta?: { label: string; url: string }) {
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#18181b">
<h2 style="margin:0 0 12px">${esc(title)}</h2>
<div style="font-size:14px;line-height:1.6">${body}</div>
${cta ? `<p style="margin:24px 0"><a href="${cta.url}" style="background:#4f46e5;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">${esc(cta.label)}</a></p>` : ''}
<p style="font-size:12px;color:#71717a;margin-top:32px">TechRover · techrover.co.in</p></div>`
}

/**
 * Notify staff members in the app (and by email if configured).
 * The person who did the action is skipped.
 */
export async function notify(
  userIds: (string | Types.ObjectId)[],
  n: { title: string; body?: string; tab?: string; task?: Types.ObjectId | string; project?: Types.ObjectId | string },
  opts: { skip?: string; email?: boolean } = {}
) {
  const ids = Array.from(new Set(userIds.map(String))).filter((id) => id && id !== opts.skip)
  if (!ids.length) return
  await Notification.insertMany(ids.map((user) => ({ user, title: n.title, body: n.body ?? '', tab: n.tab ?? '', task: n.task, project: n.project })))
  if (opts.email) {
    const users = await User.find({ _id: { $in: ids }, active: true }, { email: 1 }).lean()
    await sendEmail(
      users.map((u) => u.email),
      n.title,
      emailLayout(n.title, esc(n.body ?? ''), process.env.SITE_URL ? { label: 'Open Workspace', url: `${process.env.SITE_URL}/admin/dashboard` } : undefined)
    )
  }
}

/** Ids of active owners and managers (for approvals and alerts). */
export async function managerIds() {
  const users = await User.find({ active: true, role: { $in: ['owner', 'manager'] } }, { _id: 1 }).lean()
  return users.map((u) => String(u._id))
}

/** Tell owners/managers about a new website lead (in-app, and email if configured). */
export async function alertNewLead(lead: { _id: unknown; type: string; name?: string; email?: string; company?: string; message?: string }) {
  const label: Record<string, string> = { contact: 'contact form', meeting: 'meeting request', hire_team: 'hire-a-team request', collaboration: 'collaboration proposal' }
  const title = `New ${label[lead.type] ?? 'lead'}: ${lead.name || lead.email}${lead.company ? ` (${lead.company})` : ''}`
  await notify(await managerIds(), { title, body: (lead.message ?? '').slice(0, 200), tab: lead.type === 'meeting' ? 'schedule' : 'contacts' })
  const extra = (process.env.NOTIFY_EMAIL ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  if (extra.length) {
    await sendEmail(extra, title, emailLayout(title, `<p>${(lead.message ?? '').replace(/</g, '&lt;').slice(0, 1000)}</p><p>Email: ${lead.email ?? ''}</p>`, process.env.SITE_URL ? { label: 'Open leads', url: `${process.env.SITE_URL}/admin/dashboard` } : undefined))
  }
}
