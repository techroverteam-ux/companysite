'use client'

import { useEffect, type ReactNode } from 'react'
import { Loader2, X } from 'lucide-react'
import { initials, type StaffUser } from './lib'

/* Small UI kit for the Workspace screens (matches the zinc/indigo admin look). */

export function Panel({ title, action, children, className = '' }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-xl ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  )
}

export function Stat({ label, value, hint, tone = 'default' }: { label: string; value: ReactNode; hint?: ReactNode; tone?: 'default' | 'warn' | 'good' }) {
  const color = tone === 'warn' ? 'text-amber-300' : tone === 'good' ? 'text-emerald-300' : 'text-white'
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${color}`}>{value}</div>
      {hint && <div className="mt-0.5 text-xs text-zinc-500">{hint}</div>}
    </div>
  )
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' | 'outline'; size?: 'sm' | 'md'; busy?: boolean }
export function Btn({ variant = 'outline', size = 'md', busy, className = '', children, disabled, ...rest }: BtnProps) {
  const v = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20',
    ghost: 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
    danger: 'bg-rose-600/90 text-white hover:bg-rose-500',
    outline: 'border border-zinc-700 bg-zinc-950/60 text-zinc-200 hover:bg-zinc-800',
  }[variant]
  const s = size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-9 px-3.5 text-sm'
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${v} ${s} ${className}`}
      disabled={disabled || busy}
      {...rest}
    >
      {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  )
}

export const inputCls =
  'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

/** Compact control for filter bars (does not stretch). */
export const filterCls =
  'w-auto rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export function Field({ label, children, hint, className = '' }: { label: string; children: ReactNode; hint?: ReactNode; className?: string }) {
  return (
    <label className={`block space-y-1 ${className}`}>
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-zinc-500">{hint}</span>}
    </label>
  )
}

export function Modal({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-zinc-800 px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}

export function Drawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-zinc-800 bg-zinc-900 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function Avatar({ user, size = 24 }: { user?: Pick<StaffUser, 'name' | 'color'> | null; size?: number }) {
  if (!user) return null
  return (
    <span
      title={user.name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-zinc-900"
      style={{ width: size, height: size, background: user.color || '#6366f1', fontSize: Math.max(9, size * 0.4) }}
    >
      {initials(user.name)}
    </span>
  )
}

export function AvatarStack({ ids, users, max = 4 }: { ids: string[]; users: Map<string, StaffUser>; max?: number }) {
  const list = ids.map((id) => users.get(id)).filter(Boolean) as StaffUser[]
  if (!list.length) return <span className="text-xs text-zinc-500">Unassigned</span>
  return (
    <span className="flex -space-x-1.5">
      {list.slice(0, max).map((u) => (
        <Avatar key={u.id} user={u} />
      ))}
      {list.length > max && <span className="ml-2 text-xs text-zinc-400">+{list.length - max}</span>}
    </span>
  )
}

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${className}`}>{children}</span>
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-800 px-6 py-10 text-center">
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      {children && <div className="mt-2 text-xs text-zinc-500">{children}</div>}
    </div>
  )
}

export function Loading() {
  return (
    <div className="flex items-center justify-center py-16 text-zinc-500">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
    </div>
  )
}

/** Multi-select of people as toggle chips. */
export function PeoplePicker({ users, value, onChange, disabledIds = [] }: { users: StaffUser[]; value: string[]; onChange: (ids: string[]) => void; disabledIds?: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {users.map((u) => {
        const on = value.includes(u.id)
        const disabled = disabledIds.includes(u.id)
        return (
          <button
            type="button"
            key={u.id}
            disabled={disabled}
            onClick={() => onChange(on ? value.filter((v) => v !== u.id) : [...value, u.id])}
            className={`flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-2.5 text-xs transition-colors disabled:opacity-40 ${
              on ? 'border-indigo-500 bg-indigo-600/20 text-white' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
            }`}
          >
            <Avatar user={u} size={20} />
            {u.name}
          </button>
        )
      })}
    </div>
  )
}
