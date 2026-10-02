'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarOff, Check, ChevronLeft, ChevronRight, LogIn, LogOut, Plus, X } from 'lucide-react'
import { useWorkspace } from './context'
import { addDays, api, fmtDate, fmtMinutes, isManager, isoDay, mondayOf } from './lib'
import { Avatar, Btn, Empty, Field, inputCls, Loading, Modal, Panel, Pill } from './ui'

type Row = { id: string; user: string; date: string; checkIn: string | null; checkOut: string | null; minutes: number; plan: string; summary: string; mode: 'office' | 'remote' }
type LeaveLite = { id: string; user: string; from: string; to: string; type: string; halfDay: boolean }
type Leave = LeaveLite & { reason: string; status: 'pending' | 'approved' | 'rejected' | 'cancelled'; decisionNote: string; createdAt: string }
type Resp = { today: string; mine: Row | null; rows: Row[]; leaves: LeaveLite[] }

const LEAVE_LABEL: Record<string, string> = { casual: 'Casual leave', sick: 'Sick leave', earned: 'Earned leave', unpaid: 'Unpaid leave', wfh: 'Work from home' }
const LEAVE_STATUS: Record<Leave['status'], string> = {
  pending: 'border-amber-800 bg-amber-950/50 text-amber-300',
  approved: 'border-emerald-800 bg-emerald-950/50 text-emerald-300',
  rejected: 'border-rose-800 bg-rose-950/50 text-rose-300',
  cancelled: 'border-zinc-700 text-zinc-500',
}
const time = (iso: string | null) => (iso ? new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—')

/** Compact check-in / check-out card (used on My Work and Attendance). */
export function CheckInCard({ compact = false }: { compact?: boolean }) {
  const { notify, bump, version } = useWorkspace()
  const [mine, setMine] = useState<Row | null | undefined>(undefined)
  const [plan, setPlan] = useState('')
  const [summary, setSummary] = useState('')
  const [mode, setMode] = useState<'office' | 'remote'>('office')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api<Resp>('/api/admin/attendance').then((r) => setMine(r.mine)).catch(() => setMine(null))
  }, [version])

  const act = async (body: Record<string, unknown>) => {
    setBusy(true)
    try {
      const r = await api<{ mine: Row }>('/api/admin/attendance', { method: 'POST', body })
      setMine(r.mine)
      notify(body.action === 'check_in' ? 'Checked in. Have a good day!' : 'Checked out. Thanks!')
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  if (mine === undefined) return null
  if (mine?.checkOut) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm">
        <span className="text-zinc-300">
          <Check className="mr-1.5 inline h-4 w-4 text-emerald-400" />
          Day done: {time(mine.checkIn)} – {time(mine.checkOut)} <span className="text-zinc-500">({fmtMinutes(mine.minutes)})</span>
        </span>
      </div>
    )
  }
  if (mine?.checkIn) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-zinc-300">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
            Checked in at <b className="text-white">{time(mine.checkIn)}</b> · {mine.mode === 'remote' ? 'Remote' : 'Office'}
          </span>
          {compact && mine.plan && <span className="truncate text-xs text-zinc-500">Plan: {mine.plan}</span>}
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input className={inputCls} placeholder="What did you finish today? Any blockers?" value={summary} onChange={(e) => setSummary(e.target.value)} />
          <Btn variant="outline" busy={busy} onClick={() => act({ action: 'check_out', summary })}>
            <LogOut className="h-4 w-4" /> Check out
          </Btn>
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-indigo-900/60 bg-indigo-950/20 p-4">
      <div className="text-sm font-medium text-white">Good morning! Start your day</div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input className={inputCls} placeholder="Today's plan (e.g. finish TR-12 checkout API, review TR-15)" value={plan} onChange={(e) => setPlan(e.target.value)} />
        <select className={`${inputCls} sm:w-32`} value={mode} onChange={(e) => setMode(e.target.value as 'office' | 'remote')} aria-label="Where">
          <option value="office">Office</option>
          <option value="remote">Remote</option>
        </select>
        <Btn variant="primary" busy={busy} onClick={() => act({ action: 'check_in', plan, mode })}>
          <LogIn className="h-4 w-4" /> Check in
        </Btn>
      </div>
    </div>
  )
}

export function AttendanceView() {
  const { me, users, userMap, notify, version, bump } = useWorkspace()
  const manager = isManager(me)
  const [week, setWeek] = useState(mondayOf(isoDay()))
  const [data, setData] = useState<Resp | null>(null)
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [form, setForm] = useState<null | { from: string; to: string; type: string; halfDay: boolean; reason: string }>(null)
  const [busy, setBusy] = useState(false)
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(week, i)), [week])

  const load = useCallback(async () => {
    try {
      const [a, l] = await Promise.all([
        api<Resp>(`/api/admin/attendance?from=${days[0]}&to=${days[6]}`),
        api<{ leaves: Leave[] }>('/api/admin/leaves'),
      ])
      setData(a)
      setLeaves(l.leaves)
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }, [days, notify])
  useEffect(() => {
    load()
  }, [load, version])

  const submitLeave = async () => {
    if (!form) return
    setBusy(true)
    try {
      await api('/api/admin/leaves', { method: 'POST', body: form })
      notify('Leave requested. Your manager has been notified.')
      setForm(null)
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }
  const decide = async (id: string, status: 'approved' | 'rejected' | 'cancelled') => {
    const note = status === 'rejected' ? window.prompt('Reason (optional)') ?? '' : ''
    try {
      await api(`/api/admin/leaves/${id}`, { method: 'PATCH', body: { status, note } })
      notify(`Leave ${status}.`)
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  if (!data) return <Loading />
  const today = data.today
  const people = manager ? users : users.filter((u) => u.id === me.id)
  const cell = (userId: string, day: string) => {
    const row = data.rows.find((r) => r.user === userId && r.date === day)
    const leave = data.leaves.find((l) => l.user === userId && l.from <= day && l.to >= day)
    return { row, leave }
  }
  const pending = leaves.filter((l) => l.status === 'pending' && (manager ? l.user !== me.id || me.role === 'owner' : false))
  const myLeaves = leaves.filter((l) => l.user === me.id)
  const todayRows = data.rows.filter((r) => r.date === today)

  return (
    <div className="space-y-6">
      <CheckInCard />

      {manager && pending.length > 0 && (
        <Panel title={`Leave requests waiting for you · ${pending.length}`}>
          <ul className="divide-y divide-zinc-800">
            {pending.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
                <Avatar user={userMap.get(l.user)} size={26} />
                <span className="min-w-0 flex-1">
                  <span className="font-medium text-zinc-100">{userMap.get(l.user)?.name}</span> · {LEAVE_LABEL[l.type]}
                  {l.halfDay ? ' (half day)' : ''} · {fmtDate(l.from)}
                  {l.to !== l.from ? ` – ${fmtDate(l.to)}` : ''}
                  {l.reason && <span className="block text-xs text-zinc-500">{l.reason}</span>}
                </span>
                <Btn size="sm" variant="primary" onClick={() => decide(l.id, 'approved')}>
                  <Check className="h-3.5 w-3.5" /> Approve
                </Btn>
                <Btn size="sm" variant="ghost" className="text-rose-300" onClick={() => decide(l.id, 'rejected')}>
                  <X className="h-3.5 w-3.5" /> Reject
                </Btn>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {manager && (
        <Panel title={`Today · ${todayRows.length} of ${users.length} checked in`}>
          {!todayRows.length ? (
            <p className="text-xs text-zinc-500">Nobody has checked in yet.</p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {todayRows.map((r) => (
                <li key={r.id} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar user={userMap.get(r.user)} size={22} />
                    <span className="font-medium text-zinc-100">{userMap.get(r.user)?.name}</span>
                    <span className="text-xs text-zinc-500">
                      {time(r.checkIn)}
                      {r.checkOut ? ` – ${time(r.checkOut)}` : ' · working'} · {r.mode}
                    </span>
                  </div>
                  {r.plan && <p className="mt-1.5 text-xs text-zinc-400"><b className="text-zinc-300">Plan:</b> {r.plan}</p>}
                  {r.summary && <p className="mt-1 text-xs text-zinc-400"><b className="text-zinc-300">Done:</b> {r.summary}</p>}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      <Panel
        title={manager ? 'Team attendance' : 'My attendance'}
        action={
          <div className="flex items-center gap-1">
            <button className="rounded p-1 text-zinc-400 hover:text-white" onClick={() => setWeek(addDays(week, -7))} aria-label="Previous week">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-zinc-300">
              {fmtDate(days[0])} – {fmtDate(days[6])}
            </span>
            <button className="rounded p-1 text-zinc-400 hover:text-white" onClick={() => setWeek(addDays(week, 7))} aria-label="Next week">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="pb-2 text-left">Member</th>
                {days.map((d) => (
                  <th key={d} className={`pb-2 text-center ${d === today ? 'text-indigo-300' : ''}`}>
                    {new Date(`${d}T12:00:00`).toLocaleDateString('en-IN', { weekday: 'short' })} {d.slice(8)}
                  </th>
                ))}
                <th className="pb-2 text-right">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
              {people.map((u) => {
                let total = 0
                return (
                  <tr key={u.id}>
                    <td className="py-2">
                      <span className="flex items-center gap-2">
                        <Avatar user={u} size={22} /> {u.name}
                      </span>
                    </td>
                    {days.map((d) => {
                      const { row, leave } = cell(u.id, d)
                      total += row?.minutes ?? 0
                      const weekend = [0, 6].includes(new Date(`${d}T12:00:00`).getDay())
                      return (
                        <td key={d} className="py-2 text-center" title={row ? `${time(row.checkIn)} – ${time(row.checkOut)}${row.plan ? `\nPlan: ${row.plan}` : ''}${row.summary ? `\nDone: ${row.summary}` : ''}` : ''}>
                          {leave ? (
                            <span className="rounded bg-amber-950/60 px-1.5 py-0.5 text-[10px] text-amber-300">{leave.type === 'wfh' ? 'WFH' : 'Leave'}</span>
                          ) : row ? (
                            <span className={row.checkOut ? 'text-emerald-300' : 'text-sky-300'}>{row.checkOut ? fmtMinutes(row.minutes) : time(row.checkIn)}</span>
                          ) : d > today || weekend ? (
                            <span className="text-zinc-700">·</span>
                          ) : (
                            <span className="text-rose-400/70">absent</span>
                          )}
                        </td>
                      )
                    })}
                    <td className="py-2 text-right font-semibold text-zinc-100">{fmtMinutes(total)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-zinc-600">Green = hours between check-in and check-out. Blue = checked in, not yet out. Hover a day for the plan and summary.</p>
      </Panel>

      <Panel
        title="My leave"
        action={
          <Btn size="sm" variant="primary" onClick={() => setForm({ from: isoDay(), to: isoDay(), type: 'casual', halfDay: false, reason: '' })}>
            <Plus className="h-3.5 w-3.5" /> Request leave
          </Btn>
        }
      >
        {!myLeaves.length ? (
          <Empty title="No leave requests yet." />
        ) : (
          <ul className="divide-y divide-zinc-800">
            {myLeaves.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                <CalendarOff className="h-4 w-4 text-zinc-500" />
                <span className="flex-1 text-zinc-200">
                  {LEAVE_LABEL[l.type]}
                  {l.halfDay ? ' (half day)' : ''} · {fmtDate(l.from)}
                  {l.to !== l.from ? ` – ${fmtDate(l.to)}` : ''}
                  {l.decisionNote && <span className="block text-xs text-zinc-500">Note: {l.decisionNote}</span>}
                </span>
                <Pill className={LEAVE_STATUS[l.status]}>{l.status}</Pill>
                {(l.status === 'pending' || (l.status === 'approved' && l.from > today)) && (
                  <Btn size="sm" variant="ghost" onClick={() => decide(l.id, 'cancelled')}>
                    Cancel
                  </Btn>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {manager && leaves.some((l) => l.user !== me.id && l.status !== 'pending') && (
        <Panel title="Team leave history">
          <ul className="divide-y divide-zinc-800 text-sm">
            {leaves
              .filter((l) => l.user !== me.id && l.status !== 'pending')
              .slice(0, 30)
              .map((l) => (
                <li key={l.id} className="flex items-center gap-3 py-2">
                  <Avatar user={userMap.get(l.user)} size={20} />
                  <span className="flex-1 text-zinc-300">
                    {userMap.get(l.user)?.name} · {LEAVE_LABEL[l.type]} · {fmtDate(l.from)}
                    {l.to !== l.from ? ` – ${fmtDate(l.to)}` : ''}
                  </span>
                  <Pill className={LEAVE_STATUS[l.status]}>{l.status}</Pill>
                </li>
              ))}
          </ul>
        </Panel>
      )}

      <Modal
        open={!!form}
        onClose={() => setForm(null)}
        title="Request leave"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setForm(null)}>
              Cancel
            </Btn>
            <Btn variant="primary" busy={busy} onClick={submitLeave}>
              Send request
            </Btn>
          </>
        }
      >
        {form && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="From">
              <input type="date" className={inputCls} value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value, to: e.target.value > form.to ? e.target.value : form.to })} />
            </Field>
            <Field label="To">
              <input type="date" className={inputCls} min={form.from} value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
            </Field>
            <Field label="Type">
              <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {Object.entries(LEAVE_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <label className="flex items-end gap-2 pb-2 text-sm text-zinc-300">
              <input type="checkbox" checked={form.halfDay} onChange={(e) => setForm({ ...form, halfDay: e.target.checked })} className="rounded border-zinc-700 bg-zinc-900" />
              Half day
            </label>
            <Field label="Reason" className="sm:col-span-2">
              <textarea className={`${inputCls} min-h-[70px]`} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </Field>
          </div>
        )}
      </Modal>
    </div>
  )
}
