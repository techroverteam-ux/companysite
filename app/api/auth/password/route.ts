import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { ApiError, logActivity, parseBody, requireUser, route } from '@/lib/api'
import { User } from '@/lib/models'

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(10, 'Use at least 10 characters.').max(200),
})

export const POST = route(async (req) => {
  const me = await requireUser(req)
  const { currentPassword, newPassword } = await parseBody(req, schema)
  const user = await User.findById(me._id).select('+passwordHash')
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    throw new ApiError(400, 'Current password is wrong.')
  }
  user.passwordHash = await bcrypt.hash(newPassword, 12)
  await user.save()
  await logActivity(me, 'user.password_changed', 'User', me._id, `${me.name} changed their password`)
  return NextResponse.json({ ok: true })
})
