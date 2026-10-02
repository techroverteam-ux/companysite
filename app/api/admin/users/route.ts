import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { ApiError, isManager, logActivity, parseBody, requireUser, route } from '@/lib/api'
import { ROLES, User } from '@/lib/models'

const userInput = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(ROLES).default('member'),
  title: z.string().trim().max(100).default(''),
  hourlyRate: z.coerce.number().min(0).max(100000).default(0),
  weeklyCapacityHours: z.coerce.number().min(0).max(80).default(40),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).default('#6366f1'),
  password: z.string().min(10, 'Temporary password needs at least 10 characters.').max(200),
})

/** Everyone logged in can list active staff (needed for assignee pickers). Managers also get rates. */
export const GET = route(async (req) => {
  const me = await requireUser(req)
  const includeInactive = req.nextUrl.searchParams.get('all') === '1' && isManager(me)
  const users = await User.find(includeInactive ? {} : { active: true })
    .sort({ active: -1, name: 1 })
    .lean()
  return NextResponse.json({
    users: users.map((u) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role,
      title: u.title,
      color: u.color,
      active: u.active,
      weeklyCapacityHours: u.weeklyCapacityHours,
      lastLoginAt: u.lastLoginAt,
      ...(isManager(me) ? { hourlyRate: u.hourlyRate } : {}),
    })),
  })
})

export const POST = route(async (req) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const input = await parseBody(req, userInput)
  if (input.role === 'owner' && me.role !== 'owner') throw new ApiError(403, 'Only an owner can add another owner.')
  if (await User.exists({ email: input.email })) throw new ApiError(409, 'A team member with this email already exists.')
  const { password, ...rest } = input
  const user = await User.create({ ...rest, passwordHash: await bcrypt.hash(password, 12) })
  await logActivity(me, 'user.created', 'User', user._id, `${me.name} added ${user.name} as ${user.role}`)
  return NextResponse.json({ id: String(user._id) }, { status: 201 })
})
