'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, Pencil, Plus, Trash2 } from 'lucide-react'
import { useWorkspace } from './context'
import { addDays, api, downloadCsv, fmtDate, fmtHours, fmtMinutes, inr, isManager, isoDay, mondayOf, type Task, type TimeLog } from './lib'
import { Avatar, Btn, Empty, Field, inputCls, filterCls, Loading, Modal, Panel, Stat } from './ui'

export function Timesheets({ initialUser = '' }: { initialUser?: string }) {
  const { me } = useWorkspace()
  const [tab, setTab] = useState<'week' | 'reports'>('week')
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-0.5 w-fit">
        {(['week', 'reports'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-md px-3 py-1.5 text-xs font-medium ${tab === t ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}>
            {t === 'week' ? 'Weekly timesheet' : isManager(me) ? 'Team reports' : 'My report'}
          </button>
        ))}
      </div>
      {tab === 'week' ? <WeekSheet initialUser={initialUser} /> : <Reports />}
    </div>
  )
}

type EntryForm = { id?: string; user: string; project: string; task: string; date: string; hours: string; minutes: string; note: string; billable: boolean }

function WeekSheet({ initialUser }: { initialUser: string }) {
  const { me, users, userMap, projects, projectMap, version, bump, notify } = useWorkspace()
  const manager = isManager(me)
  const [user, setUser] = useState(initialUser || me.id)
  const [week, setWeek] = useState(mondayOf(isoDay()))
  const [logs, setLogs] = useState<TimeLog[] | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [entry, setEntry] = useState<EntryForm | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (initialUser) setUser(initialUser)
  }, [initialUser])

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(week, i)), [week])

  const load = useCallback(async () => {
    try {
      const [l, t] = await Promise.all([
        api<{ logs: TimeLog[] }>(`/api/admin/time?user=${user}&from=${days[0]}&to=${days[6]}`),
        api<{ tasks: Task[] }>('/api/admin/tasks'),
      ])
      setLogs(l.logs.filter((x) => !x.running))
      setTasks(t.tasks)
    } catch (e: any) {
      notify(e.message, 'error')
      setLogs([])
    }
  }, [user, days, notify])

  useEffect(() => {
    load()
  }, [load, version])

  const taskMap = useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks])

  const rows = useMemo(() => {
    const m = new Map<string, { project: string; task: string | null; perDay: Record<string, number>; total: number }>()
    for (const l of logs ?? []) {
      const key = `${l.project}:${l.task ?? ''}`
      const r = m.get(key) ?? { project: l.project, task: l.task, perDay: {}, total: 0 }
      const d = l.date.slice(0, 10)
      r.perDay[d] = (r.perDay[d] ?? 0) + l.minutes
      r.total += l.minutes
      m.set(key, r)
    }
    return Array.from(m.values()).sort((a, b) => b.total - a.total)
  }, [logs])

  const dayTotals = days.map((d) => (logs ?? []).filter((l) => l.date.slice(0, 10) === d).reduce((s, l) => s + l.minutes, 0))
  const weekTotal = dayTotals.reduce((a, b) => a + b, 0)
  const cap = userMap.get(user)?.weeklyCapacityHours ?? 40

  const openNew = (date = isoDay() < days[6] ? isoDay() : days[0]) =>
    setEntry({ user, project: '', task: '', date, hours: '', minutes: '', note: '', billable: true })
  const openEdit = (l: TimeLog) =>
    setEntry({ id: l.id, user: l.user, project: l.project, task: l.task ?? '', date: l.date.slice(0, 10), hours: String(Math.floor(l.minutes / 60)), minutes: String(l.minutes % 60), note: l.note, billable: l.billable })

  const save = async () => {
    if (!entry) return
    const minutes = Math.round(Number(entry.hours || 0) * 60 + Number(entry.minutes || 0))
    const body = { project: entry.project || undefined, task: entry.task || null, date: entry.date, minutes, note: entry.note, billable: entry.billable }
    setBusy(true)
    try {
      if (entry.id) await api(`/api/admin/time/${entry.id}`, { method: 'PATCH', body })
      else await api('/api/admin/time', { method: 'POST', body: { ...body, user: entry.user } })
      notify('Time saved.')
      setEntry(null)
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }
  const remove = async (id: string) => {
    if (!window.confirm('Delete this time entry?')) return
    try {
      await api(`/api/admin/time/${id}`, { method: 'DELETE' })
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  const canEdit = (l: TimeLog) => manager || l.user === me.id
  const entryTasks = tasks.filter((t) => !entry?.project || t.project === entry.project)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {manager && (
            <select className={filterCls} value={user} onChange={(e) => setUser(e.target.value)} aria-label="Team member">
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id === me.id ? `${u.name} (me)` : u.name}
                </option>
              ))}
            </select>
          )}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/60">
            <button className="p-2 text-zinc-400 hover:text-white" onClick={() => setWeek(addDays(week, -7))} aria-label="Previous week">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-sm text-zinc-200">
              {fmtDate(days[0])} – {fmtDate(days[6], { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <button className="p-2 text-zinc-400 hover:text-white" onClick={() => setWeek(addDays(week, 7))} aria-label="Next week">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {week !== mondayOf(isoDay()) && (
            <Btn variant="ghost" size="sm" onClick={() => setWeek(mondayOf(isoDay()))}>
              This week
            </Btn>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400">
            <span className="font-semibold text-white">{fmtHours(weekTotal)}h</span> of {cap}h
          </span>
          <Btn variant="primary" size="sm" onClick={() => openNew()}>
            <Plus className="h-4 w-4" /> Add time
          </Btn>
        </div>
      </div>

      {logs === null ? (
        <Loading />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/60">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-3 text-left">Project / task</th>
                  {days.map((d) => (
                    <th key={d} className={`px-2 py-3 text-center ${d === isoDay() ? 'text-indigo-300' : ''}`}>
                      {new Date(`${d}T12:00:00`).toLocaleDateString('en-IN', { weekday: 'short' })}
                      <div className="text-[10px] font-normal normal-case text-zinc-600">{fmtDate(d)}</div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70 text-zinc-200">
                {rows.map((r) => (
                  <tr key={`${r.project}:${r.task}`}>
                    <td className="max-w-[260px] px-4 py-2.5">
                      <div className="truncate font-medium">{r.task ? taskMap.get(r.task)?.title ?? 'Task' : 'General / no task'}</div>
                      <div className="truncate text-[11px] text-zinc-500">{projectMap.get(r.project)?.name ?? 'Project'}</div>
                    </td>
                    {days.map((d) => (
                      <td key={d} className="px-2 py-2.5 text-center text-xs">
                        {r.perDay[d] ? fmtMinutes(r.perDay[d]) : <span className="text-zinc-700">·</span>}
                      </td>
                    ))}
                    <td className="px-4 py-2.5 text-right font-semibold">{fmtMinutes(r.total)}</td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-zinc-500">
                      No time logged this week.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="border-t border-zinc-800 bg-zinc-950/40 text-xs">
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-zinc-300">Day total</td>
                  {dayTotals.map((m, i) => (
                    <td key={days[i]} className={`px-2 py-2.5 text-center ${m > 600 ? 'text-amber-300' : 'text-zinc-300'}`}>
                      {m ? fmtMinutes(m) : '—'}
                    </td>
                  ))}
                  <td className="px-4 py-2.5 text-right font-bold text-white">{fmtMinutes(weekTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <Panel title="Entries">
            {!logs.length ? (
              <p className="text-xs text-zinc-500">Nothing yet.</p>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {logs.map((l) => (
                  <li key={l.id} className="flex items-center gap-3 py-2 text-sm">
                    <span className="w-20 shrink-0 text-xs text-zinc-500">{fmtDate(l.date, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span className="w-16 shrink-0 font-semibold text-zinc-100">{fmtMinutes(l.minutes)}</span>
                    <span className="min-w-0 flex-1 truncate text-zinc-300">
                      {l.task ? taskMap.get(l.task)?.title : projectMap.get(l.project)?.name}
                      {l.note && <span className="text-zinc-500"> — {l.note}</span>}
                    </span>
                    {!l.billable && <span className="text-[10px] uppercase text-zinc-500">non-billable</span>}
                    {canEdit(l) && (
                      <>
                        <button onClick={() => openEdit(l)} className="text-zinc-500 hover:text-white" aria-label="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => remove(l.id)} className="text-zinc-500 hover:text-rose-400" aria-label="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </>
      )}

      <Modal
        open={!!entry}
        onClose={() => setEntry(null)}
        title={entry?.id ? 'Edit time entry' : 'Add time'}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setEntry(null)}>
              Cancel
            </Btn>
            <Btn variant="primary" onClick={save} busy={busy}>
              Save
            </Btn>
          </>
        }
      >
        {entry && (
          <div className="grid gap-3 sm:grid-cols-2">
            {manager && !entry.id && (
              <Field label="Team member" className="sm:col-span-2">
                <select className={inputCls} value={entry.user} onChange={(e) => setEntry({ ...entry, user: e.target.value })}>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <Field label="Project">
              <select className={inputCls} value={entry.project} onChange={(e) => setEntry({ ...entry, project: e.target.value, task: '' })}>
                <option value="">Choose…</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Task (optional)">
              <select className={inputCls} value={entry.task} onChange={(e) => setEntry({ ...entry, task: e.target.value, project: e.target.value ? taskMap.get(e.target.value)?.project ?? entry.project : entry.project })}>
                <option value="">General / no task</option>
                {entryTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date">
              <input type="date" className={inputCls} max={isoDay()} value={entry.date} onChange={(e) => setEntry({ ...entry, date: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Hours">
                <input type="number" min={0} max={24} className={inputCls} value={entry.hours} onChange={(e) => setEntry({ ...entry, hours: e.target.value })} />
              </Field>
              <Field label="Minutes">
                <input type="number" min={0} max={59} className={inputCls} value={entry.minutes} onChange={(e) => setEntry({ ...entry, minutes: e.target.value })} />
              </Field>
            </div>
            <Field label="Note" className="sm:col-span-2">
              <input className={inputCls} value={entry.note} onChange={(e) => setEntry({ ...entry, note: e.target.value })} placeholder="What did you work on?" />
            </Field>
            <label className="flex items-center gap-2 text-xs text-zinc-400 sm:col-span-2">
              <input type="checkbox" checked={entry.billable} onChange={(e) => setEntry({ ...entry, billable: e.target.checked })} className="rounded border-zinc-700 bg-zinc-900" />
              Billable to the client
            </label>
          </div>
        )}
      </Modal>
    </div>
  )
}

type Report = {
  from: string
  to: string
  total: { minutes: number; billableMinutes: number; cost?: number }
  byUser: { id: string; name: string; color?: string; minutes: number; billableMinutes: number; cost?: number }[]
  byProject: { id: string; name: string; client: string; budgetHours: number; minutes: number; billableMinutes: number; cost?: number }[]
  byDay: { day: string; minutes: number }[]
  detail: { day: string; userName: string; projectName: string; taskTitle: string; minutes: number; billableMinutes: number; cost?: number }[]
}

function Reports() {
  const { me, projects, userMap, version, notify } = useWorkspace()
  const manager = isManager(me)
  const today = isoDay()
  const presets = useMemo(() => {
    const mon = mondayOf(today)
    const first = `${today.slice(0, 8)}01`
    const lastMonthEnd = addDays(first, -1)
    return {
      'This week': [mon, today],
      'Last week': [addDays(mon, -7), addDays(mon, -1)],
      'This month': [first, today],
      'Last month': [`${lastMonthEnd.slice(0, 8)}01`, lastMonthEnd],
    } as Record<string, [string, string]>
  }, [today])
  const [range, setRange] = useState<[string, string]>(presets['This month'])
  const [project, setProject] = useState('')
  const [report, setReport] = useState<Report | null>(null)

  useEffect(() => {
    const sp = new URLSearchParams({ from: range[0], to: range[1] })
    if (project) sp.set('project', project)
    api<Report>(`/api/admin/reports/time?${sp}`)
      .then(setReport)
      .catch((e) => notify(e.message, 'error'))
  }, [range, project, version, notify])

  const exportCsv = () => {
    if (!report) return
    downloadCsv(`timesheet_${report.from}_to_${report.to}.csv`, [
      ['Date', 'Member', 'Project', 'Task', 'Hours', 'Billable hours', ...(manager ? ['Cost (INR)'] : [])],
      ...report.detail.map((d) => [d.day, d.userName, d.projectName, d.taskTitle, (d.minutes / 60).toFixed(2), (d.billableMinutes / 60).toFixed(2), ...(manager ? [d.cost ?? 0] : [])]),
    ])
  }

  const maxDay = Math.max(1, ...(report?.byDay.map((d) => d.minutes) ?? [1]))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(presets).map(([label, r]) => (
            <Btn key={label} size="sm" variant={range[0] === r[0] && range[1] === r[1] ? 'primary' : 'outline'} onClick={() => setRange(r)}>
              {label}
            </Btn>
          ))}
          <input type="date" className={filterCls} value={range[0]} onChange={(e) => setRange([e.target.value, range[1]])} aria-label="From" />
          <input type="date" className={filterCls} value={range[1]} onChange={(e) => setRange([range[0], e.target.value])} aria-label="To" />
          <select className={filterCls} value={project} onChange={(e) => setProject(e.target.value)} aria-label="Project">
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <Btn variant="outline" size="sm" onClick={exportCsv} disabled={!report?.detail.length}>
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Btn>
      </div>

      {!report ? (
        <Loading />
      ) : !report.detail.length ? (
        <Empty title="No time logged in this period." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Total hours" value={fmtHours(report.total.minutes)} />
            <Stat label="Billable hours" value={fmtHours(report.total.billableMinutes)} hint={`${Math.round((report.total.billableMinutes / Math.max(1, report.total.minutes)) * 100)}% billable`} />
            <Stat label="Days with time" value={report.byDay.length} />
            {manager ? <Stat label="Team cost" value={inr(report.total.cost ?? 0)} hint="From each member’s hourly rate" /> : <Stat label="Projects" value={report.byProject.length} />}
          </div>

          <Panel title="Hours per day">
            <div className="flex h-32 items-end gap-1">
              {report.byDay.map((d) => (
                <div key={d.day} className="group flex h-full flex-1 flex-col items-center justify-end" title={`${fmtDate(d.day)}: ${fmtMinutes(d.minutes)}`}>
                  <div className="w-full max-w-[28px] rounded-t bg-indigo-500/80 group-hover:bg-indigo-400" style={{ height: `${Math.max(4, (d.minutes / maxDay) * 100)}%` }} />
                  <span className="mt-1 text-[9px] text-zinc-600">{d.day.slice(8)}</span>
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid gap-4 xl:grid-cols-2">
            {manager && (
              <Panel title="By team member">
                <table className="w-full text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="pb-2 text-left">Member</th>
                      <th className="pb-2 text-right">Hours</th>
                      <th className="pb-2 text-right">Billable</th>
                      <th className="pb-2 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70 text-zinc-200">
                    {report.byUser.map((u) => (
                      <tr key={u.id}>
                        <td className="py-2">
                          <span className="flex items-center gap-2">
                            <Avatar user={userMap.get(u.id) ?? { name: u.name, color: u.color ?? '#6366f1' }} size={22} /> {u.name}
                          </span>
                        </td>
                        <td className="py-2 text-right font-semibold">{fmtHours(u.minutes)}</td>
                        <td className="py-2 text-right text-zinc-400">{fmtHours(u.billableMinutes)}</td>
                        <td className="py-2 text-right text-zinc-400">{inr(u.cost ?? 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            )}
            <Panel title="By project">
              <table className="w-full text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="pb-2 text-left">Project</th>
                    <th className="pb-2 text-right">Hours</th>
                    <th className="pb-2 text-right">Billable</th>
                    {manager && <th className="pb-2 text-right">Cost</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70 text-zinc-200">
                  {report.byProject.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2">
                        <div>{p.name}</div>
                        <div className="text-[11px] text-zinc-500">{p.client}</div>
                      </td>
                      <td className="py-2 text-right font-semibold">{fmtHours(p.minutes)}</td>
                      <td className="py-2 text-right text-zinc-400">{fmtHours(p.billableMinutes)}</td>
                      {manager && <td className="py-2 text-right text-zinc-400">{inr(p.cost ?? 0)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </div>

          <Panel title="Detail">
            <div className="max-h-[420px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-zinc-900 text-[11px] uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="pb-2 text-left">Date</th>
                    {manager && <th className="pb-2 text-left">Member</th>}
                    <th className="pb-2 text-left">Project</th>
                    <th className="pb-2 text-left">Task</th>
                    <th className="pb-2 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                  {report.detail.map((d, i) => (
                    <tr key={i}>
                      <td className="py-1.5 text-xs text-zinc-500">{fmtDate(d.day)}</td>
                      {manager && <td className="py-1.5">{d.userName}</td>}
                      <td className="py-1.5">{d.projectName}</td>
                      <td className="max-w-[260px] truncate py-1.5 text-zinc-400">{d.taskTitle}</td>
                      <td className="py-1.5 text-right font-medium text-zinc-100">{fmtMinutes(d.minutes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}
    </div>
  )
}
