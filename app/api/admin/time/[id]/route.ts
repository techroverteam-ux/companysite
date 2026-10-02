import { NextResponse } from 'next/server'
import { ApiError, dayUTC, isManager, oid, parseBody, requireUser, route } from '@/lib/api'
import { timePatch } from '@/lib/schemas'
import { TimeLog } from '@/lib/models'
import { resolveTarget, serializeLog } from '@/lib/time'

type Ctx = { params: Promise<{ id: string }> }

async function loadOwnOrManaged(req: Parameters<typeof requireUser>[0], id: string) {
  const me = await requireUser(req)
  const log = await TimeLog.findById(oid(id))
  if (!log) throw new ApiError(404, 'Time entry not found.')
  if (String(log.user) !== me.id && !isManager(me)) throw new ApiError(403, 'You can only change your own time entries.')
  return { me, log }
}

export const PATCH = route<Ctx>(async (req, { params }) => {
  const { me, log } = await loadOwnOrManaged(req, (await params).id)
  const input = await parseBody(req, timePatch)
  if (log.running && (input.minutes !== undefined || input.date)) {
    throw new ApiError(400, 'Stop the timer before editing its time.')
  }
  if (input.task !== undefined || input.project) {
    const target = await resolveTarget(me, input.project ?? String(log.project), input.task ?? undefined)
    log.project = target.project
    log.set('task', target.task)
  }
  if (input.date) log.date = dayUTC(input.date)
  if (input.minutes !== undefined) log.minutes = input.minutes
  if (input.note !== undefined) log.note = input.note
  if (input.billable !== undefined) log.billable = input.billable
  await log.save()
  return NextResponse.json({ log: serializeLog(log.toObject()) })
})

export const DELETE = route<Ctx>(async (req, { params }) => {
  const { log } = await loadOwnOrManaged(req, (await params).id)
  await log.deleteOne()
  return NextResponse.json({ ok: true })
})
