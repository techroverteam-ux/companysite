'use client'

import type { ReactNode } from 'react'

export const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`
export const dt = (v?: string | null) => (v ? new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '')

export async function call<T = any>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, { method: body ? 'POST' : 'GET', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const d = data?.details && Object.values(data.details as Record<string, string[]>).flat()[0]
    throw new Error(d || data?.error || 'Something went wrong.')
  }
  return data
}

export function Shell({ children, subtitle }: { children: ReactNode; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <header className="mb-8 flex items-center gap-3">
        <img src="/logos/tec-rover/techrover-shortlogo.png" alt="" className="h-9 w-9 rounded-lg object-contain" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
        <div>
          <div className="text-lg font-bold text-slate-900">TechRover</div>
          {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
        </div>
      </header>
      {children}
      <footer className="mt-12 text-center text-xs text-slate-400">This is a private link. Please don't share it. · techrover.co.in</footer>
    </div>
  )
}

export function Card({ title, children, right }: { title?: ReactNode; children: ReactNode; right?: ReactNode }) {
  return (
    <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {(title || right) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {right}
        </div>
      )}
      {children}
    </section>
  )
}

export const input = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
export const btn = 'inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50'

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'good' | 'bad'; children: ReactNode }) {
  const c = tone === 'good' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : tone === 'bad' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-indigo-200 bg-indigo-50 text-indigo-800'
  return <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${c}`}>{children}</div>
}
