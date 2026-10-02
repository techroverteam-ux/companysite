import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { DEFAULT_ONBOARDING, Project } from '@/lib/models'

type Ctx = { params: Promise<{ id: string }> }

const schema = z.object({
  key: z.string().min(1).max(60),
  done: z.boolean().optional(),
  label: z.string().trim().min(2).max(200).optional(), // add a custom item
  remove: z.boolean().optional(),
})

/** Tick / untick, add or remove an onboarding checklist item. */
export const PATCH = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const project = await Project.findById(oid((await params).id))
  if (!project) throw new ApiError(404, 'Project not found.')
  const input = await parseBody(req, schema)
  const list = project.onboarding?.length ? project.onboarding : DEFAULT_ONBOARDING.map((o) => ({ ...o, done: false }))
  const items = list.map((o: any) => ({ key: o.key, label: o.label, done: !!o.done, doneAt: o.doneAt, doneBy: o.doneBy }))
  const idx = items.findIndex((o) => o.key === input.key)

  if (input.remove) {
    if (idx >= 0) items.splice(idx, 1)
  } else if (idx < 0) {
    if (!input.label) throw new ApiError(400, 'Give the new checklist item a label.')
    items.push({ key: input.key, label: input.label, done: false, doneAt: undefined, doneBy: undefined })
  } else if (input.done !== undefined) {
    items[idx] = { ...items[idx], done: input.done, doneAt: input.done ? new Date() : undefined, doneBy: input.done ? me._id : undefined }
  }
  project.set('onboarding', items)
  await project.save()
  if (input.done && idx >= 0) await logActivity(me, 'project.onboarding', 'Project', project._id, `${me.name} completed “${items[idx].label}” for ${project.name}`, project._id)
  return NextResponse.json({ onboarding: items })
})
