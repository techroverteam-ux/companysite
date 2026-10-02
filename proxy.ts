import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

function withSecurityHeaders(res: NextResponse) {
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  return res
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value)

  // Staff APIs: must be logged in (each route also re-checks the user and role in the database).
  if (pathname.startsWith('/api/admin')) {
    if (!session) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 })
    return NextResponse.next()
  }

  // Admin pages: everything except the login page needs a valid session.
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (session) return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      return withSecurityHeaders(NextResponse.next())
    }
    if (!session) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('next', pathname + search)
      return NextResponse.redirect(url)
    }
    return withSecurityHeaders(NextResponse.next())
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
