'use client'

/* ------------------------------------------------------------------ */
/* Types returned by /api/admin/*                                      */
/* ------------------------------------------------------------------ */
export type Role = 'owner' | 'manager' | 'member'
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'qa' | 'done'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'

export type Me = {
  id: string
  name: string
  email: string
  role: Role
  title: string
  hourlyRate: number
  weeklyCapacityHours: number
  color: string
}

export type StaffUser = {
  id: string
  name: string
  email: string
  role: Role
  title: string
  color: string
  active: boolean
  weeklyCapacityHours: number
  hourlyRate?: number
  lastLoginAt?: string
}

export type Project = {
  id: string
  name: string
  client: string
  description: string
  status: ProjectStatus
  startDate?: string | null
  dueDate?: string | null
  budgetHours: number
  lead: string | null
  members: string[]
  repoUrl: string
  stats: { tasks: number; done: number; overdue: number; estimateHours: number; loggedMinutes: number }
}

export type Task = {
  id: string
  project: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  assignees: string[]
  dueDate: string | null
  estimateHours: number
  labels: string[]
  link: string
  position: number
  completedAt: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
  loggedMinutes: number
}

export type TimeLog = {
  id: string
  user: string
  project: string
  task: string | null
  date: string
  minutes: number
  note: string
  billable: boolean
  running: boolean
  startedAt: string | null
  endedAt?: string | null
}

/* ------------------------------------------------------------------ */
/* Fetch helper                                                         */
/* ------------------------------------------------------------------ */
export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: Record<string, string[]>) {
    super(message)
  }
}

export async function api<T = any>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(path, {
    method: init.method ?? 'GET',
    headers: init.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: 'no-store',
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401 && typeof window !== 'undefined' && !path.startsWith('/api/auth')) {
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`
  }
  if (!res.ok) {
    const details = data?.details as Record<string, string[]> | undefined
    const first = details && Object.entries(details).find(([, v]) => v?.length)
    throw new HttpError(res.status, first ? `${first[0]}: ${first[1][0]}` : data?.error || `Request failed (${res.status})`, details)
  }
  return data as T
}

/* ------------------------------------------------------------------ */
/* Labels and formatting                                               */
/* ------------------------------------------------------------------ */
export const TASK_COLUMNS: { id: TaskStatus; label: string; dot: string }[] = [
  { id: 'todo', label: 'To do', dot: 'bg-zinc-400' },
  { id: 'in_progress', label: 'In progress', dot: 'bg-sky-400' },
  { id: 'review', label: 'Code review', dot: 'bg-violet-400' },
  { id: 'qa', label: 'QA / Testing', dot: 'bg-amber-400' },
  { id: 'done', label: 'Done', dot: 'bg-emerald-400' },
]
export const STATUS_LABEL = Object.fromEntries(TASK_COLUMNS.map((c) => [c.id, c.label])) as Record<TaskStatus, string>

export const PRIORITY: Record<Priority, { label: string; cls: string }> = {
  low: { label: 'Low', cls: 'bg-zinc-800 text-zinc-300 border-zinc-700' },
  medium: { label: 'Medium', cls: 'bg-sky-950/60 text-sky-300 border-sky-900' },
  high: { label: 'High', cls: 'bg-amber-950/60 text-amber-300 border-amber-900' },
  urgent: { label: 'Urgent', cls: 'bg-rose-950/60 text-rose-300 border-rose-900' },
}

export const PROJECT_STATUS: Record<ProjectStatus, { label: string; cls: string }> = {
  planning: { label: 'Planning', cls: 'bg-zinc-800 text-zinc-300 border-zinc-700' },
  active: { label: 'Active', cls: 'bg-emerald-950/60 text-emerald-300 border-emerald-900' },
  on_hold: { label: 'On hold', cls: 'bg-amber-950/60 text-amber-300 border-amber-900' },
  completed: { label: 'Completed', cls: 'bg-indigo-950/60 text-indigo-300 border-indigo-900' },
  cancelled: { label: 'Cancelled', cls: 'bg-zinc-900 text-zinc-500 border-zinc-800' },
}

export const ROLE_LABEL: Record<Role, string> = { owner: 'Owner', manager: 'Manager', member: 'Team member' }

export const isManager = (u?: { role: Role } | null) => u?.role === 'owner' || u?.role === 'manager'

/** 95 → "1h 35m" */
export function fmtMinutes(min: number) {
  const m = Math.round(min || 0)
  const h = Math.floor(m / 60)
  const r = m % 60
  if (!h) return `${r}m`
  return r ? `${h}h ${r}m` : `${h}h`
}
export const fmtHours = (min: number) => (Math.round(((min || 0) / 60) * 10) / 10).toString()

/** Local calendar date as YYYY-MM-DD. */
export function isoDay(d: Date = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
export function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + n)
  return isoDay(d)
}
export function mondayOf(iso: string) {
  const d = new Date(`${iso}T12:00:00`)
  const dow = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - dow)
  return isoDay(d)
}
export function fmtDate(value?: string | null, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) {
  if (!value) return ''
  const d = new Date(value.length === 10 ? `${value}T12:00:00` : value)
  return d.toLocaleDateString('en-IN', opts)
}
export function dayOnly(value?: string | null) {
  return value ? value.slice(0, 10) : ''
}
export function isOverdue(t: Pick<Task, 'dueDate' | 'status'>) {
  return !!t.dueDate && t.status !== 'done' && dayOnly(t.dueDate) < isoDay()
}
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}
export function inr(n: number) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
