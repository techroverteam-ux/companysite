import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, assertProjectAccess, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { Comment, Task, User } from '@/lib/models'
import { notify } from '@/lib/workflow'

type Ctx = { params: Promise<{ id: string }> }

export const POST = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req)
  const task = await Task.findById(oid((await params).id))
  if (!task) throw new ApiError(404, 'Task not found.')
  await assertProjectAccess(me, task.project)
  const { text } = await parseBody(req, z.object({ text: z.string().trim().min(1).max(4000) }))
  const c = await Comment.create({ task: task._id, user: me._id, text })
  // Notify assignees, the creator and anyone @mentioned by first name or full name.
  const staff = await User.find({ active: true }, { name: 1 }).lean()
  const lower = text.toLowerCase()
  const mentioned = staff.filter((u) => lower.includes(`@${u.name.toLowerCase()}`) || lower.includes(`@${u.name.split(' ')[0].toLowerCase()}`)).map((u) => String(u._id))
  await notify(
    [...task.assignees.map(String), ...(task.createdBy ? [String(task.createdBy)] : []), ...mentioned],
    { title: `${me.name} commented on TR-${task.number ?? ''} ${task.title}`, body: text.slice(0, 200), tab: 'tasks', task: task._id, project: task.project },
    { skip: me.id, email: mentioned.length > 0 }
  )
  await logActivity(me, 'task.commented', 'Task', task._id, `${me.name} commented on “${task.title}”`, task.project)
  return NextResponse.json(
    { comment: { id: String(c._id), user: me.id, text: c.text, createdAt: c.createdAt } },
    { status: 201 }
  )
})
