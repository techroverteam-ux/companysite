'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AdminLogin } from '@/components/admin/login'

function LoginInner() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next')
  const target = next && next.startsWith('/admin') && !next.startsWith('/admin/login') ? next : '/admin/dashboard'
  return <AdminLogin onLogin={() => { router.replace(target); router.refresh() }} />
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  )
}
