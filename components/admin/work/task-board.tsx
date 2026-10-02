'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CalendarDays, Clock, Grid, List, Play, Plus, Search } from 'lucide-react'
import { useWorkspace } from './context'
import { api, fmtDate, fmtMinutes, isManager, isOverdue, PRIORITY, STATUS_LABEL, TASK_COLUMNS, type Priority, type Task, type TaskStatus } from './lib'
import { AvatarStack, Btn, Empty, inputCls, filterCls, Loading, Pill } from './ui'

export function TaskBoard({ initialProject = '', initialAssignee = '' }: { initialProject?: string; initialAssignee?: string }) {
  const { me, users, userMap, projects, projectMap, version, bump, notify, openTask, openNewTask, startTimer, timer } = useWorkspace()
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [project, setProject] = useState(initialProject)
  const [assignee, setAssignee] = useState(initialAssignee)
  const [priority, setPriority] = useState('')
  const [q, setQ] = useState('')
  const [view, setView] = useState<'board' | 'list'>('board')
  const [hideDone, setHideDone] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overCol, setOverCol] = useState<TaskStatus | null>(null)

  useEffect(() => setProject(initialProject), [initialProject])
  useEffect(() => setAssignee(initialAssignee), [initialAssignee])

  const load = useCallback(async () => {
    const sp = new URLSearchParams()
    if (project) sp.set('project', project)
    if (assignee) sp.set('assignee', assignee)
    if (priority) sp.set('priority', priority)
    try {
      const res = await api<{ tasks: Task[] }>(`/api/admin/tasks?${sp}`)
      setTasks(res.tasks)
    } catch (e: any) {
      notify(e.message, 'error')
      setTasks([])
    }
  }, [project, assignee, priority, notify])

  useEffect(() => {
    load()
  }, [load, version])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return (tasks ?? []).filter((t) => (!needle || t.title.toLowerCase().includes(needle) || t.labels.some((l) => l.toLowerCase().includes(needle))) && (!hideDone || t.status !== 'done'))
  }, [tasks, q, hideDone])

  const byCol = useMemo(() => {
    const m = new Map<TaskStatus, Task[]>(TASK_COLUMNS.map((c) => [c.id, []]))
    for (const t of filtered) m.get(t.status)?.push(t)
    for (const list of m.values()) list.sort((a, b) => a.position - b.position)
    return m
  }, [filtered])

  const move = async (taskId: string, status: TaskStatus) => {
    const t = tasks?.find((x) => x.id === taskId)
    if (!t || t.status === status) return
    setTasks((prev) => prev?.map((x) => (x.id === taskId ? { ...x, status, position: Date.now() } : x)) ?? null)
    try {
      await api(`/api/admin/tasks/${taskId}?position=${Date.now()}`, { method: 'PATCH', body: { status } })
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
      load()
    }
  }

  const openCount = (tasks ?? []).filter((t) => t.status !== 'done').length
  const overdue = (tasks ?? []).filter(isOverdue).length

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <input className={`${inputCls} pl-8`} placeholder="Search tasks or labels" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className={filterCls} value={project} onChange={(e) => setProject(e.target.value)} aria-label="Project">
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select className={filterCls} value={assignee} onChange={(e) => setAssignee(e.target.value)} aria-label="Assignee">
            <option value="">Everyone</option>
            <option value="me">Assigned to me</option>
            <option value="none">Unassigned</option>
            {users
              .filter((u) => u.id !== me.id)
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
          </select>
          <select className={filterCls} value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
            <option value="">Any priority</option>
            {(Object.keys(PRIORITY) as Priority[]).map((p) => (
              <option key={p} value={p}>
                {PRIORITY[p].label}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-1.5 text-xs text-zinc-400">
            <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} className="rounded border-zinc-700 bg-zinc-900" />
            Hide done
          </label>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">
            {openCount} open{overdue ? <span className="text-rose-400"> · {overdue} overdue</span> : null}
          </span>
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950/60 p-0.5">
            {(['board', 'list'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium ${view === v ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                {v === 'board' ? <Grid className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
                {v === 'board' ? 'Board' : 'List'}
              </button>
            ))}
          </div>
          <Btn variant="primary" size="sm" onClick={() => openNewTask({ project: project || undefined })}>
            <Plus className="h-4 w-4" /> New task
          </Btn>
        </div>
      </div>

      {tasks === null ? (
        <Loading />
      ) : !projects.length ? (
        <Empty title="No projects yet">{isManager(me) ? 'Create a project in Projects, then add tasks to it.' : 'Ask a manager to add you to a project.'}</Empty>
      ) : view === 'board' ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {TASK_COLUMNS.filter((c) => !hideDone || c.id !== 'done').map((col) => {
            const list = byCol.get(col.id) ?? []
            return (
              <div
                key={col.id}
                onDragOver={(e) => {
                  e.preventDefault()
                  setOverCol(col.id)
                }}
                onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
                onDrop={(e) => {
                  e.preventDefault()
                  const id = e.dataTransfer.getData('text/plain') || dragId
                  setOverCol(null)
                  setDragId(null)
                  if (id) move(id, col.id)
                }}
                className={`flex min-h-[200px] min-w-[220px] flex-1 flex-col rounded-xl border bg-zinc-950/50 transition-colors ${overCol === col.id ? 'border-indigo-500 bg-indigo-950/20' : 'border-zinc-800'}`}
              >
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                    {col.label}
                    <span className="rounded-full bg-zinc-800 px-1.5 text-[10px] text-zinc-400">{list.length}</span>
                  </div>
                  <button onClick={() => openNewTask({ project: project || undefined, status: col.id })} className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white" aria-label={`Add task to ${col.label}`}>
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-1 flex-col gap-2 px-2 pb-2">
                  {list.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      showProject={!project}
                      projectName={projectMap.get(t.project)?.name}
                      users={userMap}
                      onOpen={() => openTask(t.id)}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', t.id)
                        setDragId(t.id)
                      }}
                      timing={timer?.task === t.id}
                      onStart={t.assignees.includes(me.id) && timer?.task !== t.id ? () => startTimer({ task: t.id }) : undefined}
                    />
                  ))}
                  {!list.length && <div className="rounded-lg border border-dashed border-zinc-800 py-6 text-center text-[11px] text-zinc-600">Drop tasks here</div>}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Assignees</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3 text-right">Time / est.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {filtered
                  .slice()
                  .sort((a, b) => (a.status === 'done' ? 1 : 0) - (b.status === 'done' ? 1 : 0) || (a.dueDate ?? '9').localeCompare(b.dueDate ?? '9'))
                  .map((t) => (
                    <tr key={t.id} onClick={() => openTask(t.id)} className="cursor-pointer text-zinc-200 hover:bg-zinc-800/40">
                      <td className="max-w-[320px] truncate px-4 py-3 font-medium">{t.title}</td>
                      <td className="px-4 py-3 text-zinc-400">{projectMap.get(t.project)?.name}</td>
                      <td className="px-4 py-3">
                        <select
                          value={t.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => move(t.id, e.target.value as TaskStatus)}
                          className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-200"
                        >
                          {TASK_COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <Pill className={PRIORITY[t.priority].cls}>{PRIORITY[t.priority].label}</Pill>
                      </td>
                      <td className="px-4 py-3">
                        <AvatarStack ids={t.assignees} users={userMap} />
                      </td>
                      <td className={`px-4 py-3 text-xs ${isOverdue(t) ? 'font-semibold text-rose-400' : 'text-zinc-400'}`}>{fmtDate(t.dueDate) || '—'}</td>
                      <td className="px-4 py-3 text-right text-xs text-zinc-400">
                        {fmtMinutes(t.loggedMinutes)}
                        {t.estimateHours ? ` / ${t.estimateHours}h` : ''}
                      </td>
                    </tr>
                  ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                      No tasks match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <p className="text-[11px] text-zinc-600">Tip: drag cards between columns to change status. Statuses: {Object.values(STATUS_LABEL).join(' → ')}.</p>
    </div>
  )
}

function TaskCard({
  task,
  showProject,
  projectName,
  users,
  onOpen,
  onDragStart,
  onStart,
  timing,
}: {
  task: Task
  showProject: boolean
  projectName?: string
  users: Map<string, any>
  onOpen: () => void
  onDragStart: (e: React.DragEvent) => void
  onStart?: () => void
  timing: boolean
}) {
  const overdue = isOverdue(task)
  const over = task.estimateHours > 0 && task.loggedMinutes / 60 > task.estimateHours
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      className={`group cursor-pointer rounded-lg border bg-zinc-900 p-3 shadow-sm transition-colors hover:border-zinc-600 ${timing ? 'border-emerald-700' : 'border-zinc-800'}`}
    >
      {showProject && projectName && <div className="mb-1 truncate text-[10px] font-semibold uppercase tracking-wider text-indigo-300/80">{projectName}</div>}
      <div className="text-sm font-medium leading-snug text-zinc-100">{task.title}</div>
      {task.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.labels.slice(0, 3).map((l) => (
            <span key={l} className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
              {l}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Pill className={PRIORITY[task.priority].cls}>{PRIORITY[task.priority].label}</Pill>
          {task.dueDate && (
            <span className={`flex items-center gap-0.5 text-[11px] ${overdue ? 'font-semibold text-rose-400' : 'text-zinc-500'}`}>
              {overdue ? <AlertTriangle className="h-3 w-3" /> : <CalendarDays className="h-3 w-3" />}
              {fmtDate(task.dueDate)}
            </span>
          )}
        </div>
        <AvatarStack ids={task.assignees} users={users} max={3} />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
        <span className={`flex items-center gap-1 ${over ? 'text-rose-400' : ''}`}>
          <Clock className="h-3 w-3" />
          {fmtMinutes(task.loggedMinutes)}
          {task.estimateHours ? ` / ${task.estimateHours}h` : ''}
        </span>
        {timing ? (
          <span className="font-semibold text-emerald-400">Timer running</span>
        ) : onStart ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onStart()
            }}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-indigo-300 opacity-0 hover:bg-indigo-950 group-hover:opacity-100"
          >
            <Play className="h-3 w-3 fill-current" /> Start
          </button>
        ) : null}
      </div>
    </div>
  )
}
