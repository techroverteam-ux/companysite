import { NextResponse } from 'next/server'
import { getCurrentUser, route } from '@/lib/api'

export const GET = route(async (req) => {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ user: null }, { status: 401 })
  const { _id, ...rest } = user
  return NextResponse.json({ user: rest })
})
