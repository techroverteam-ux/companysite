import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { ApiError, clientIp, parseBody, rateLimit, route } from '@/lib/api'
import { User } from '@/lib/models'
import { SESSION_COOKIE, sessionCookieOptions, signSession } from '@/lib/session'

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
})

export const POST = route(async (req) => {
  const ip = clientIp(req)
  rateLimit(`login:${ip}`, 10, 60_000)
  const { email, password } = await parseBody(req, schema)

  let user = await User.findOne({ email }).select('+passwordHash')

  // First-run bootstrap: when there are no staff accounts yet, the owner logs in with
  // ADMIN_EMAIL / ADMIN_PASSWORD from the environment and that account is created.
  if (!user && (await User.estimatedDocumentCount()) === 0) {
    const seedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const seedPassword = process.env.ADMIN_PASSWORD
    if (seedEmail && seedPassword && seedPassword.length >= 10 && email === seedEmail && password === seedPassword) {
      user = await User.create({
        name: process.env.ADMIN_NAME || 'Owner',
        email: seedEmail,
        passwordHash: await bcrypt.hash(seedPassword, 12),
        role: 'owner',
        title: 'Founder',
      })
    }
  }

  const ok = user && user.active && (await bcrypt.compare(password, user.passwordHash))
  if (!ok || !user) {
    await new Promise((r) => setTimeout(r, 400))
    throw new ApiError(401, 'Wrong email or password.')
  }

  user.lastLoginAt = new Date()
  await user.save()

  const token = await signSession({ sub: String(user._id), role: user.role, name: user.name })
  const res = NextResponse.json({
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
  })
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
  return res
})
