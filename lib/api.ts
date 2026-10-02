import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { z } from 'zod'
import { connectDB } from '@/lib/db'
import { Activity, Project, User, type Role } from '@/lib/models'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message)
  }
}

export type CurrentUser = {
  _id: Types.ObjectId
  id: string
  name: string
  email: string
  role: Role
  title: string
  hourlyRate: number
  weeklyCapacityHours: number
  color: string
}

type Handler<C> = (req: NextRequest, ctx: C) => Promise<Response>

/** Wraps a route handler: connects to the DB and turns thrown errors into JSON responses. */
export function route<C = unknown>(fn: Handler<C>): Handler<C> {
  return async (req, ctx) => {
    try {
      await connectDB()
      return await fn(req, ctx)
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json({ error: err.message, details: err.details }, { status: err.status })
      }
      if (err instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Please check the highlighted fields.', details: err.flatten().fieldErrors },
          { status: 400 }
        )
      }
      console.error('[api]', err)
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }
  }
}

export const isManager = (u: Pick<CurrentUser, 'role'>) => u.role === 'owner' || u.role === 'manager'

export async function getCurrentUser(req: NextRequest): Promise<CurrentUser | null> {
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value)
  if (!session || !Types.ObjectId.isValid(session.sub)) return null
  const user = await User.findById(session.sub).lean()
  if (!user || !user.active) return null
  return {
    _id: user._id as Types.ObjectId,
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role as Role,
    title: user.title ?? '',
    hourlyRate: user.hourlyRate ?? 0,
    weeklyCapacityHours: user.weeklyCapacityHours ?? 40,
    color: user.color ?? '#6366f1',
  }
}

/** Throws 401/403 unless a logged-in, active staff member (optionally with one of `roles`). */
export async function requireUser(req: NextRequest, roles?: Role[]): Promise<CurrentUser> {
  const user = await getCurrentUser(req)
  if (!user) throw new ApiError(401, 'Please log in again.')
  if (roles && !roles.includes(user.role)) throw new ApiError(403, 'You do not have permission to do this.')
  return user
}

export async function parseBody<T extends z.ZodTypeAny>(req: NextRequest, schema: T): Promise<z.infer<T>> {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    throw new ApiError(400, 'Invalid JSON body.')
  }
  return schema.parse(raw)
}

export function oid(id: string | null | undefined, label = 'id'): Types.ObjectId {
  if (!id || !Types.ObjectId.isValid(id)) throw new ApiError(400, `Invalid ${label}.`)
  return new Types.ObjectId(id)
}

/** Zod helper for an ObjectId string. */
export const zId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id')

/** "2026-10-02" → Date at 00:00 UTC. */
export function dayUTC(value: string | Date): Date {
  const s = typeof value === 'string' ? value.slice(0, 10) : value.toISOString().slice(0, 10)
  const d = new Date(`${s}T00:00:00.000Z`)
  if (Number.isNaN(d.getTime())) throw new ApiError(400, 'Invalid date.')
  return d
}

/** Project ids the user may see (null = all, for owners/managers). */
export async function visibleProjectIds(user: CurrentUser): Promise<Types.ObjectId[] | null> {
  if (isManager(user)) return null
  const projects = await Project.find({ $or: [{ members: user._id }, { lead: user._id }] }, { _id: 1 }).lean()
  return projects.map((p) => p._id as Types.ObjectId)
}

export async function assertProjectAccess(user: CurrentUser, projectId: Types.ObjectId) {
  const project = await Project.findById(projectId).lean()
  if (!project) throw new ApiError(404, 'Project not found.')
  if (isManager(user)) return project
  const isMember =
    String(project.lead ?? '') === user.id || (project.members ?? []).some((m) => String(m) === user.id)
  if (!isMember) throw new ApiError(403, 'You are not on this project.')
  return project
}

export async function logActivity(
  actor: CurrentUser,
  action: string,
  entityType: string,
  entityId?: Types.ObjectId | string,
  summary = '',
  project?: Types.ObjectId | string
) {
  try {
    await Activity.create({ actor: actor._id, action, entityType, entityId, summary, project })
  } catch (err) {
    console.error('[activity]', err)
  }
}

/* ------------------------------------------------------------------ */
/* Best-effort in-memory rate limiter (per server instance).           */
/* For strict limits across Vercel instances, swap for Upstash Redis.  */
/* ------------------------------------------------------------------ */
const buckets = new Map<string, { count: number; reset: number }>()
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return
  }
  b.count += 1
  if (b.count > limit) throw new ApiError(429, 'Too many requests. Please wait a minute and try again.')
}

export function clientIp(req: NextRequest) {
  return (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local'
}
