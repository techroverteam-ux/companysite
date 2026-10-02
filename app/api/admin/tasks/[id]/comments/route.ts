import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, assertProjectAccess, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { Comment, Task } from '@/lib/models'

type Ctx = { params: Promise<{ id: string }> }

export const POST = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req)
  const task = await Task.findById(oid((await params).id))
  if (!task) throw new ApiError(404, 'Task not found.')
  await assertProjectAccess(me, task.project)
  const { text } = await parseBody(req, z.object({ text: z.string().trim().min(1).max(4000) }))
  const c = await Comment.create({ task: task._id, user: me._id, text })
  await logActivity(me, 'task.commented', 'Task', task._id, `${me.name} commented on “${task.title}”`, task.project)
  return NextResponse.json(
    { comment: { id: String(c._id), user: me.id, text: c.text, createdAt: c.createdAt } },
    { status: 201 }
  )
})
