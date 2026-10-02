'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Activity, AlertTriangle, CalendarDays, Play, Plus, Square, Users } from 'lucide-react'
import { useWorkspace } from './context'
import { addDays, api, dayOnly, fmtDate, fmtHours, fmtMinutes, isManager, isOverdue, isoDay, PRIORITY, TASK_COLUMNS, type Task, type TaskStatus } from './lib'
import { Avatar, Btn, Empty, inputCls, Loading, Panel, Pill, Stat } from './ui'
import { CheckInCard } from './attendance'

type Overview = {
  me: { openTasks: number; overdueTasks: number; minutesToday: number; minutesThisWeek: number; weeklyCapacityHours: number }
  weekStart: string
  activity: { id: string; summary: string; at: string; actor: string | null }[]
  team?: {
    id: string
    name: string
    title: string
    color: string
    openTasks: number
    openEstimateHours: number
    overdueTasks: number
    minutesThisWeek: number
    weeklyCapacityHours: number
    timer: { task: string | null; project: string; startedAt: string } | null
  }[]
  unassignedTasks?: number
}

export function MyWork({ onShowTeamMember, onShowUnassigned }: { onShowTeamMember: (userId: string) => void; onShowUnassigned: () => void }) {
  const { me, userMap, projects, projectMap, version, bump, notify, openTask, openNewTask, timer, startTimer, stopTimer } = useWorkspace()
  const [overview, setOverview] = useState<Overview | null>(null)
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [quick, setQuick] = useState({ project: '', task: '', hours: '', minutes: '', note: '', date: isoDay() })

  const load = useCallback(async () => {
    try {
      const [o, t] = await Promise.all([api<Overview>('/api/admin/overview'), api<{ tasks: Task[] }>('/api/admin/tasks?assignee=me&status=open')])
      setOverview(o)
      setTasks(t.tasks)
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }, [notify])

  useEffect(() => {
    load()
  }, [load, version])

  const groups = useMemo(() => {
    const today = isoDay()
    const weekEnd = addDays(today, 7)
    const g = { overdue: [] as Task[], week: [] as Task[], later: [] as Task[] }
    for (const t of tasks ?? []) {
      if (isOverdue(t)) g.overdue.push(t)
      else if (t.dueDate && dayOnly(t.dueDate) <= weekEnd) g.week.push(t)
      else g.later.push(t)
    }
    const byDue = (a: Task, b: Task) => (a.dueDate ?? '9').localeCompare(b.dueDate ?? '9')
    const prio = { urgent: 0, high: 1, medium: 2, low: 3 }
    g.overdue.sort(byDue)
    g.week.sort(byDue)
    g.later.sort((a, b) => prio[a.priority] - prio[b.priority])
    return g
  }, [tasks])

  const setStatus = async (t: Task, status: TaskStatus) => {
    try {
      await api(`/api/admin/tasks/${t.id}`, { method: 'PATCH', body: { status } })
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  const quickLog = async () => {
    const minutes = Math.round(Number(quick.hours || 0) * 60 + Number(quick.minutes || 0))
    if (!quick.project && !quick.task) return notify('Pick a project or task.', 'error')
    if (minutes < 1) return notify('Enter the time you worked.', 'error')
    try {
      await api('/api/admin/time', {
        method: 'POST',
        body: { project: quick.project || undefined, task: quick.task || null, minutes, note: quick.note, date: quick.date },
      })
      notify('Time logged.')
      setQuick({ ...quick, hours: '', minutes: '', note: '' })
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  if (!overview || !tasks) return <Loading />
  const cap = overview.me.weeklyCapacityHours || 40
  const weekPct = Math.round((overview.me.minutesThisWeek / 60 / cap) * 100)
  const tasksForQuick = (tasks ?? []).filter((t) => !quick.project || t.project === quick.project)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Hi {me.name.split(' ')[0]} 👋</h2>
          <p className="text-sm text-zinc-500">Here’s what’s on your plate. Start a timer on a task, or log time below.</p>
        </div>
        <Btn variant="primary" size="sm" onClick={() => openNewTask({ assignees: [me.id] })}>
          <Plus className="h-4 w-4" /> New task
        </Btn>
      </div>

      <CheckInCard compact />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="My open tasks" value={overview.me.openTasks} />
        <Stat label="Overdue" value={overview.me.overdueTasks} tone={overview.me.overdueTasks ? 'warn' : 'default'} />
        <Stat label="Logged today" value={fmtMinutes(overview.me.minutesToday)} />
        <Stat label="This week" value={`${fmtHours(overview.me.minutesThisWeek)}h`} hint={`${weekPct}% of ${cap}h capacity`} tone={weekPct > 110 ? 'warn' : 'default'} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="My tasks">
          {!tasks.length ? (
            <Empty title="Nothing assigned to you right now.">Pick something from the Task Board, or ask your manager.</Empty>
          ) : (
            <div className="space-y-5">
              {(
                [
                  ['overdue', 'Overdue', groups.overdue],
                  ['week', 'Due in the next 7 days', groups.week],
                  ['later', 'Later / no due date', groups.later],
                ] as const
              ).map(([key, label, list]) =>
                list.length ? (
                  <div key={key}>
                    <h4 className={`mb-2 text-[11px] font-semibold uppercase tracking-wider ${key === 'overdue' ? 'text-rose-400' : 'text-zinc-500'}`}>
                      {label} · {list.length}
                    </h4>
                    <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800">
                      {list.map((t) => {
                        const running = timer?.task === t.id
                        return (
                          <li key={t.id} className={`flex flex-wrap items-center gap-3 px-3 py-2.5 ${running ? 'bg-emerald-950/30' : ''}`}>
                            <button onClick={() => openTask(t.id)} className="min-w-0 flex-1 text-left">
                              <div className="truncate text-sm font-medium text-zinc-100">{t.title}</div>
                              <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                                <span className="truncate">{projectMap.get(t.project)?.name}</span>
                                {t.dueDate && (
                                  <span className={`flex items-center gap-0.5 ${isOverdue(t) ? 'text-rose-400' : ''}`}>
                                    {isOverdue(t) ? <AlertTriangle className="h-3 w-3" /> : <CalendarDays className="h-3 w-3" />}
                                    {fmtDate(t.dueDate)}
                                  </span>
                                )}
                                <span>
                                  {fmtMinutes(t.loggedMinutes)}
                                  {t.estimateHours ? ` / ${t.estimateHours}h` : ''}
                                </span>
                              </div>
                            </button>
                            <Pill className={PRIORITY[t.priority].cls}>{PRIORITY[t.priority].label}</Pill>
                            <select value={t.status} onChange={(e) => setStatus(t, e.target.value as TaskStatus)} className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-200" aria-label="Status">
                              {TASK_COLUMNS.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                            {running ? (
                              <Btn variant="danger" size="sm" onClick={() => stopTimer()}>
                                <Square className="h-3 w-3 fill-current" /> Stop
                              </Btn>
                            ) : (
                              <Btn variant="outline" size="sm" onClick={() => startTimer({ task: t.id })}>
                                <Play className="h-3 w-3 fill-current" /> Start
                              </Btn>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ) : null
              )}
            </div>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Quick time entry">
            <div className="space-y-2">
              <select className={inputCls} value={quick.project} onChange={(e) => setQuick({ ...quick, project: e.target.value, task: '' })} aria-label="Project">
                <option value="">Project…</option>
                {projects
                  .filter((p) => p.status !== 'completed' && p.status !== 'cancelled')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
              <select className={inputCls} value={quick.task} onChange={(e) => setQuick({ ...quick, task: e.target.value, project: e.target.value ? tasks.find((t) => t.id === e.target.value)?.project ?? quick.project : quick.project })} aria-label="Task">
                <option value="">No specific task (meeting, admin…)</option>
                {tasksForQuick.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-2">
                <input type="date" className={inputCls} max={isoDay()} value={quick.date} onChange={(e) => setQuick({ ...quick, date: e.target.value })} aria-label="Date" />
                <input type="number" min={0} max={24} placeholder="Hours" className={inputCls} value={quick.hours} onChange={(e) => setQuick({ ...quick, hours: e.target.value })} />
                <input type="number" min={0} max={59} placeholder="Min" className={inputCls} value={quick.minutes} onChange={(e) => setQuick({ ...quick, minutes: e.target.value })} />
              </div>
              <input className={inputCls} placeholder="Note (what you worked on)" value={quick.note} onChange={(e) => setQuick({ ...quick, note: e.target.value })} />
              <div className="flex gap-2">
                <Btn variant="primary" className="flex-1" onClick={quickLog}>
                  Log time
                </Btn>
                {!timer && (
                  <Btn variant="outline" onClick={() => (quick.task || quick.project ? startTimer({ task: quick.task || null, project: quick.project || undefined, note: quick.note }) : notify('Pick a project or task.', 'error'))}>
                    <Play className="h-3.5 w-3.5 fill-current" /> Timer
                  </Btn>
                )}
              </div>
            </div>
          </Panel>

          <Panel title={<span className="flex items-center gap-2"><Activity className="h-4 w-4 text-zinc-400" /> Recent activity</span>}>
            {!overview.activity.length ? (
              <p className="text-xs text-zinc-500">No activity yet.</p>
            ) : (
              <ul className="max-h-[360px] space-y-2.5 overflow-y-auto pr-1">
                {overview.activity.map((a) => (
                  <li key={a.id} className="flex gap-2.5 text-xs">
                    <Avatar user={a.actor ? userMap.get(a.actor) : null} size={20} />
                    <div className="min-w-0">
                      <p className="text-zinc-300">{a.summary}</p>
                      <p className="text-[10px] text-zinc-600">{new Date(a.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      {isManager(me) && overview.team && (
        <Panel
          title={<span className="flex items-center gap-2"><Users className="h-4 w-4 text-zinc-400" /> Team workload this week</span>}
          action={
            overview.unassignedTasks ? (
              <button onClick={onShowUnassigned} className="text-xs text-amber-300 hover:underline">
                {overview.unassignedTasks} unassigned task{overview.unassignedTasks === 1 ? '' : 's'} →
              </button>
            ) : null
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="pb-2">Member</th>
                  <th className="pb-2">Open tasks</th>
                  <th className="pb-2">Overdue</th>
                  <th className="pb-2">Open estimate</th>
                  <th className="pb-2 w-[34%]">Logged this week (vs capacity)</th>
                  <th className="pb-2">Now</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {overview.team.map((m) => {
                  const pct = Math.round((m.minutesThisWeek / 60 / (m.weeklyCapacityHours || 40)) * 100)
                  return (
                    <tr key={m.id} className="cursor-pointer text-zinc-200 hover:bg-zinc-800/30" onClick={() => onShowTeamMember(m.id)}>
                      <td className="py-2.5">
                        <span className="flex items-center gap-2">
                          <Avatar user={m} size={26} />
                          <span>
                            <span className="block text-sm font-medium">{m.name}</span>
                            <span className="block text-[11px] text-zinc-500">{m.title}</span>
                          </span>
                        </span>
                      </td>
                      <td className="py-2.5">{m.openTasks}</td>
                      <td className={`py-2.5 ${m.overdueTasks ? 'font-semibold text-rose-400' : 'text-zinc-500'}`}>{m.overdueTasks}</td>
                      <td className="py-2.5 text-zinc-400">{m.openEstimateHours ? `${m.openEstimateHours}h` : '—'}</td>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                            <div className={`h-full ${pct > 110 ? 'bg-rose-500' : pct > 90 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, pct)}%` }} />
                          </div>
                          <span className="w-20 text-right text-xs text-zinc-400">
                            {fmtHours(m.minutesThisWeek)} / {m.weeklyCapacityHours}h
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 text-xs">
                        {m.timer ? <span className="text-emerald-400">● {projectMap.get(m.timer.project)?.name ?? 'Working'}</span> : <span className="text-zinc-600">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  )
}
