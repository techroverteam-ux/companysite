import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { ApiError, logActivity, oid, parseBody, requireUser, route } from '@/lib/api'
import { ROLES, User } from '@/lib/models'

type Ctx = { params: Promise<{ id: string }> }

const patchSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  role: z.enum(ROLES).optional(),
  title: z.string().trim().max(100).optional(),
  hourlyRate: z.coerce.number().min(0).max(100000).optional(),
  weeklyCapacityHours: z.coerce.number().min(0).max(80).optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
  active: z.boolean().optional(),
  password: z.string().min(10, 'Temporary password needs at least 10 characters.').max(200).optional(),
})

export const PATCH = route<Ctx>(async (req, { params }) => {
  const me = await requireUser(req, ['owner', 'manager'])
  const id = oid((await params).id)
  const input = await parseBody(req, patchSchema)
  const user = await User.findById(id)
  if (!user) throw new ApiError(404, 'Team member not found.')

  const touchesOwner = user.role === 'owner' || input.role === 'owner'
  if (touchesOwner && me.role !== 'owner') throw new ApiError(403, 'Only an owner can change an owner account.')
  if (String(user._id) === me.id && (input.active === false || (input.role && input.role !== me.role))) {
    throw new ApiError(400, 'You cannot deactivate yourself or change your own role.')
  }
  if (user.role === 'owner' && (input.active === false || (input.role && input.role !== 'owner'))) {
    const owners = await User.countDocuments({ role: 'owner', active: true })
    if (owners <= 1) throw new ApiError(400, 'There must always be at least one active owner.')
  }
  if (input.email && input.email !== user.email && (await User.exists({ email: input.email }))) {
    throw new ApiError(409, 'Another team member already uses this email.')
  }

  const { password, ...rest } = input
  Object.assign(user, rest)
  if (password) user.passwordHash = await bcrypt.hash(password, 12)
  await user.save()

  const what = [
    input.active === false ? 'deactivated' : input.active === true ? 'reactivated' : 'updated',
    password ? '(password reset)' : '',
  ].join(' ')
  await logActivity(me, 'user.updated', 'User', user._id, `${me.name} ${what} ${user.name}`.trim())
  return NextResponse.json({ ok: true })
})
