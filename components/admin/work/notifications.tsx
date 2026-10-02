'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { useWorkspace } from './context'
import { api } from './lib'

type Note = { id: string; title: string; body: string; tab: string; task: string | null; project: string | null; read: boolean; createdAt: string }

function ago(iso: string) {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

/** Bell with unread count; polls every 45 s. Clicking a notification opens the right screen or task. */
export function NotificationBell({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { openTask, version } = useWorkspace()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Note[]>([])
  const [unread, setUnread] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    try {
      const res = await api<{ notifications: Note[]; unread: number }>('/api/admin/notifications')
      setItems(res.notifications)
      setUnread(res.unread)
    } catch {}
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 45000)
    return () => clearInterval(id)
  }, [load, version])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const markAll = async () => {
    await api('/api/admin/notifications', { method: 'POST', body: { all: true } }).catch(() => {})
    setItems((l) => l.map((n) => ({ ...n, read: true })))
    setUnread(0)
  }
  const go = async (n: Note) => {
    if (!n.read) {
      api('/api/admin/notifications', { method: 'POST', body: { ids: [n.id] } }).catch(() => {})
      setItems((l) => l.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
      setUnread((u) => Math.max(0, u - 1))
    }
    setOpen(false)
    if (n.tab) onNavigate(n.tab)
    if (n.task) openTask(n.task)
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}>
        <Bell className="h-5 w-5" />
        {unread > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{unread > 99 ? '99+' : unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
            <span className="text-sm font-semibold text-white">Notifications</span>
            {unread > 0 && (
              <button onClick={markAll} className="flex items-center gap-1 text-xs text-indigo-300 hover:underline">
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-[420px] overflow-y-auto">
            {!items.length && <li className="px-4 py-8 text-center text-xs text-zinc-500">You're all caught up.</li>}
            {items.map((n) => (
              <li key={n.id}>
                <button onClick={() => go(n)} className={`flex w-full gap-3 px-4 py-3 text-left hover:bg-zinc-800/60 ${n.read ? '' : 'bg-indigo-950/20'}`}>
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-indigo-400'}`} />
                  <span className="min-w-0">
                    <span className="block text-sm text-zinc-100">{n.title}</span>
                    {n.body && <span className="mt-0.5 block truncate text-xs text-zinc-500">{n.body}</span>}
                    <span className="mt-0.5 block text-[10px] text-zinc-600">{ago(n.createdAt)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
