import { NextResponse } from 'next/server'
import { z } from 'zod'
import { dayUTC, logActivity, parseBody, requireUser, route, zId } from '@/lib/api'
import { TimeLog } from '@/lib/models'
import { resolveTarget, serializeLog, stopRunningTimer } from '@/lib/time'

/** The current user's running timer (or null). */
export const GET = route(async (req) => {
  const me = await requireUser(req)
  const running = await TimeLog.findOne({ user: me._id, running: true }).lean()
  return NextResponse.json({ timer: running ? serializeLog(running) : null, serverNow: new Date().toISOString() })
})

const schema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('start'),
    task: zId.nullable().optional(),
    project: zId.optional(),
    note: z.string().max(500).default(''),
    billable: z.boolean().default(true),
  }),
  z.object({ action: z.literal('stop'), note: z.string().max(500).optional() }),
])

/** Start a timer (stops any running one first) or stop the running timer. */
export const POST = route(async (req) => {
  const me = await requireUser(req)
  const input = await parseBody(req, schema)

  if (input.action === 'stop') {
    if (input.note !== undefined) await TimeLog.updateOne({ user: me._id, running: true }, { note: input.note })
    const stopped = await stopRunningTimer(me._id)
    if (stopped) {
      await logActivity(me, 'time.logged', 'TimeLog', stopped._id, `${me.name} logged ${(stopped.minutes / 60).toFixed(2)} h with the timer`, stopped.project)
    }
    return NextResponse.json({ stopped: stopped ? serializeLog(stopped.toObject()) : null, timer: null })
  }

  const target = await resolveTarget(me, input.project, input.task)
  const stopped = await stopRunningTimer(me._id)
  const now = new Date()
  const timer = await TimeLog.create({
    user: me._id,
    project: target.project,
    task: target.task,
    date: dayUTC(now),
    minutes: 0,
    note: input.note,
    billable: input.billable,
    running: true,
    startedAt: now,
  })
  return NextResponse.json({
    timer: serializeLog(timer.toObject()),
    stopped: stopped ? serializeLog(stopped.toObject()) : null,
  })
})
