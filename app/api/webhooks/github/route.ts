import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Comment, Task } from '@/lib/models'
import { notify } from '@/lib/workflow'

/**
 * GitHub webhook. Mention a task as TR-<number> in a commit message or pull request title
 * and it shows up on that task. Set GITHUB_WEBHOOK_SECRET and point the repo webhook
 * (push + pull_request events, JSON) to /api/webhooks/github.
 */
function verify(body: string, sig: string | null) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (!secret || !sig) return false
  const expected = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  } catch {
    return false
  }
}

const refs = (text: string) => Array.from(new Set(Array.from(text.matchAll(/\bTR-(\d{1,7})\b/gi), (m) => Number(m[1]))))

export async function POST(req: NextRequest) {
  const body = await req.text()
  if (!verify(body, req.headers.get('x-hub-signature-256'))) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  const event = req.headers.get('x-github-event')
  const payload = JSON.parse(body)
  await connectDB()
  let touched = 0

  if (event === 'push') {
    for (const c of payload.commits ?? []) {
      for (const n of refs(c.message ?? '')) {
        const task = await Task.findOne({ number: n })
        if (!task) continue
        await Comment.create({ task: task._id, authorName: `GitHub · ${c.author?.name ?? 'commit'}`, text: `Commit ${String(c.id).slice(0, 7)} on ${payload.ref?.replace('refs/heads/', '')}: ${c.message}\n${c.url}` })
        touched++
      }
    }
  } else if (event === 'pull_request') {
    const pr = payload.pull_request
    for (const n of refs(`${pr?.title ?? ''} ${pr?.head?.ref ?? ''}`)) {
      const task = await Task.findOne({ number: n })
      if (!task) continue
      const action = payload.action === 'closed' ? (pr.merged ? 'merged' : 'closed') : payload.action
      if (!['opened', 'merged', 'closed', 'ready_for_review'].includes(action)) continue
      await Comment.create({ task: task._id, authorName: 'GitHub', text: `Pull request #${pr.number} ${action}: ${pr.title}\n${pr.html_url}` })
      if (!task.link) task.link = pr.html_url
      if ((action === 'opened' || action === 'ready_for_review') && (task.status === 'todo' || task.status === 'in_progress')) task.status = 'review'
      if (action === 'merged' && task.status !== 'done') task.status = 'qa'
      await task.save()
      await notify(task.assignees.map(String), { title: `TR-${n}: PR #${pr.number} ${action}`, body: pr.title, tab: 'tasks', task: task._id, project: task.project })
      touched++
    }
  }
  return NextResponse.json({ ok: true, touched })
}
