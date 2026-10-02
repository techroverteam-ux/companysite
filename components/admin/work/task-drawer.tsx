'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Clock, ExternalLink, MessageSquare, Play, Square, Trash2, X } from 'lucide-react'
import { useWorkspace } from './context'
import {
  api,
  dayOnly,
  fmtDate,
  fmtMinutes,
  isManager,
  isoDay,
  PRIORITY,
  TASK_COLUMNS,
  type Priority,
  type Task,
  type TaskStatus,
  type TimeLog,
} from './lib'
import { Avatar, Btn, Drawer, Field, inputCls, PeoplePicker } from './ui'

type Comment = { id: string; user: string | null; authorName?: string; text: string; createdAt: string }
type MilestoneLite = { id: string; title: string }

type Form = {
  project: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  assignees: string[]
  dueDate: string
  estimateHours: string
  labels: string
  link: string
  type: 'feature' | 'bug' | 'chore' | 'change'
  milestone: string
}

const emptyForm = (p: Partial<Form> = {}): Form => ({
  project: '',
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assignees: [],
  dueDate: '',
  estimateHours: '',
  labels: '',
  link: '',
  type: 'feature',
  milestone: '',
  ...p,
})

function toBody(f: Form) {
  return {
    project: f.project,
    title: f.title,
    description: f.description,
    status: f.status,
    priority: f.priority,
    assignees: f.assignees,
    dueDate: f.dueDate || null,
    estimateHours: Number(f.estimateHours || 0),
    labels: f.labels.split(',').map((s) => s.trim()).filter(Boolean),
    link: f.link.trim(),
    type: f.type,
    milestone: f.milestone || null,
  }
}

/** Create / view / edit a task, log time on it and discuss it. Mounted once by the Workspace. */
export function TaskDrawer() {
  const { taskDrawer, closeTaskDrawer } = useWorkspace()
  const open = !!taskDrawer.id || !!taskDrawer.create
  return (
    <Drawer open={open} onClose={closeTaskDrawer}>
      {taskDrawer.id ? (
        <TaskDetail key={taskDrawer.id} id={taskDrawer.id} />
      ) : taskDrawer.create ? (
        <TaskCreate defaults={taskDrawer.create} />
      ) : null}
    </Drawer>
  )
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/95 px-5 py-4 backdrop-blur">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <button onClick={onClose} className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label="Close">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

function TaskFields({ form, setForm, canAssignOthers, allowProjectChange }: { form: Form; setForm: (f: Form) => void; canAssignOthers: boolean; allowProjectChange: boolean }) {
  const { projects, users, me, projectMap } = useWorkspace()
  const project = projectMap.get(form.project)
  const set = (patch: Partial<Form>) => setForm({ ...form, ...patch })
  // Managers see everyone; members can only toggle themselves.
  const pickable = canAssignOthers ? users : users.filter((u) => u.id === me.id || form.assignees.includes(u.id))
  const disabledIds = canAssignOthers ? [] : pickable.filter((u) => u.id !== me.id).map((u) => u.id)
  const [milestones, setMilestones] = useState<MilestoneLite[]>([])
  useEffect(() => {
    if (!form.project) return setMilestones([])
    api<{ milestones: MilestoneLite[] }>(`/api/admin/projects/${form.project}/milestones`).then((r) => setMilestones(r.milestones)).catch(() => setMilestones([]))
  }, [form.project])
  const openProjects = projects.filter((p) => (p.status !== 'completed' && p.status !== 'cancelled') || p.id === form.project)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Title" className="sm:col-span-2">
        <input className={inputCls} value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Build checkout API" autoFocus />
      </Field>
      <Field label="Project">
        <select className={inputCls} value={form.project} onChange={(e) => set({ project: e.target.value })} disabled={!allowProjectChange}>
          <option value="">Choose a project…</option>
          {openProjects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.client ? ` · ${p.client}` : ''}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Status">
        <select className={inputCls} value={form.status} onChange={(e) => set({ status: e.target.value as TaskStatus })}>
          {TASK_COLUMNS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Priority">
        <select className={inputCls} value={form.priority} onChange={(e) => set({ priority: e.target.value as Priority })}>
          {(Object.keys(PRIORITY) as Priority[]).map((p) => (
            <option key={p} value={p}>
              {PRIORITY[p].label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Due date">
        <input type="date" className={inputCls} value={form.dueDate} onChange={(e) => set({ dueDate: e.target.value })} />
      </Field>
      <Field label="Type">
        <select className={inputCls} value={form.type} onChange={(e) => set({ type: e.target.value as Form['type'] })}>
          <option value="feature">Feature</option>
          <option value="bug">Bug</option>
          <option value="chore">Chore / setup</option>
          <option value="change">Change request</option>
        </select>
      </Field>
      <Field label="Milestone">
        <select className={inputCls} value={form.milestone} onChange={(e) => set({ milestone: e.target.value })}>
          <option value="">None</option>
          {milestones.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Estimate (hours)">
        <input type="number" min={0} step={0.5} className={inputCls} value={form.estimateHours} onChange={(e) => set({ estimateHours: e.target.value })} placeholder="0" />
      </Field>
      <Field label="Labels" hint="Comma separated, e.g. frontend, bug">
        <input className={inputCls} value={form.labels} onChange={(e) => set({ labels: e.target.value })} />
      </Field>
      <Field label="Assignees" className="sm:col-span-2" hint={!canAssignOthers ? 'Only managers can assign other people. You can assign yourself.' : project && !project.members.length ? 'Assigned people are added to the project automatically.' : undefined}>
        <PeoplePicker users={pickable} value={form.assignees} onChange={(ids) => set({ assignees: ids })} disabledIds={disabledIds} />
      </Field>
      <Field label="Link (GitHub PR, issue, Figma…)" className="sm:col-span-2">
        <input className={inputCls} value={form.link} onChange={(e) => set({ link: e.target.value })} placeholder="https://github.com/…" />
      </Field>
      <Field label="Description" className="sm:col-span-2">
        <textarea className={`${inputCls} min-h-[120px]`} value={form.description} onChange={(e) => set({ description: e.target.value })} placeholder="Acceptance criteria, notes, steps…" />
      </Field>
    </div>
  )
}

function TaskCreate({ defaults }: { defaults: { project?: string; status?: string; assignees?: string[] } }) {
  const { me, closeTaskDrawer, notify, bump, projects, openTask } = useWorkspace()
  const [form, setForm] = useState<Form>(() =>
    emptyForm({
      project: defaults.project ?? (projects.length === 1 ? projects[0].id : ''),
      status: (defaults.status as TaskStatus) ?? 'todo',
      assignees: defaults.assignees ?? (isManager(me) ? [] : [me.id]),
    })
  )
  const [busy, setBusy] = useState(false)

  const save = async () => {
    if (!form.project) return notify('Choose a project first.', 'error')
    setBusy(true)
    try {
      const res = await api<{ task: Task }>('/api/admin/tasks', { method: 'POST', body: toBody(form) })
      notify('Task created.')
      bump()
      openTask(res.task.id)
    } catch (e: any) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <Header title="New task" onClose={closeTaskDrawer} />
      <div className="space-y-5 p-5">
        {!projects.length ? (
          <p className="text-sm text-zinc-400">There are no projects yet. {isManager(me) ? 'Create a project first.' : 'Ask a manager to add you to a project.'}</p>
        ) : (
          <TaskFields form={form} setForm={setForm} canAssignOthers={isManager(me)} allowProjectChange />
        )}
        <div className="flex justify-end gap-2">
          <Btn variant="ghost" onClick={closeTaskDrawer}>
            Cancel
          </Btn>
          <Btn variant="primary" onClick={save} busy={busy} disabled={!form.title.trim() || !form.project}>
            Create task
          </Btn>
        </div>
      </div>
    </div>
  )
}

function TaskDetail({ id }: { id: string }) {
  const { me, userMap, projectMap, closeTaskDrawer, notify, bump, timer, startTimer, stopTimer, version } = useWorkspace()
  const [task, setTask] = useState<Task | null>(null)
  const [logs, setLogs] = useState<TimeLog[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [form, setForm] = useState<Form>(emptyForm())
  const [busy, setBusy] = useState(false)
  const [comment, setComment] = useState('')
  const [log, setLog] = useState({ date: isoDay(), hours: '', minutes: '', note: '', billable: true })
  const manager = isManager(me)

  const load = useCallback(async () => {
    try {
      const res = await api<{ task: Task; timeLogs: TimeLog[]; comments: Comment[] }>(`/api/admin/tasks/${id}`)
      setTask(res.task)
      setLogs(res.timeLogs)
      setComments(res.comments)
      setForm(
        emptyForm({
          project: res.task.project,
          title: res.task.title,
          description: res.task.description,
          status: res.task.status,
          priority: res.task.priority,
          assignees: res.task.assignees,
          dueDate: dayOnly(res.task.dueDate),
          estimateHours: res.task.estimateHours ? String(res.task.estimateHours) : '',
          labels: res.task.labels.join(', '),
          link: res.task.link,
          type: res.task.type ?? 'feature',
          milestone: res.task.milestone ?? '',
        })
      )
    } catch (e: any) {
      notify(e.message, 'error')
      closeTaskDrawer()
    }
  }, [id, notify, closeTaskDrawer])

  useEffect(() => {
    load()
  }, [load, version])

  const dirty = useMemo(() => {
    if (!task) return false
    return JSON.stringify(toBody(form)) !==
      JSON.stringify(
        toBody(
          emptyForm({
            project: task.project,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            assignees: task.assignees,
            dueDate: dayOnly(task.dueDate),
            estimateHours: task.estimateHours ? String(task.estimateHours) : '',
            labels: task.labels.join(', '),
            link: task.link,
            type: task.type ?? 'feature',
            milestone: task.milestone ?? '',
          })
        )
      )
  }, [form, task])

  if (!task) {
    return (
      <div>
        <Header title="Task" onClose={closeTaskDrawer} />
        <div className="p-8 text-sm text-zinc-500">Loading…</div>
      </div>
    )
  }

  const save = async () => {
    setBusy(true)
    try {
      await api(`/api/admin/tasks/${id}`, { method: 'PATCH', body: toBody(form) })
      notify('Task saved.')
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!window.confirm(`Delete “${task.title}”? This cannot be undone.`)) return
    try {
      await api(`/api/admin/tasks/${id}`, { method: 'DELETE' })
      notify('Task deleted.')
      bump()
      closeTaskDrawer()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  const addLog = async () => {
    const minutes = Math.round(Number(log.hours || 0) * 60 + Number(log.minutes || 0))
    if (minutes < 1) return notify('Enter the hours or minutes you worked.', 'error')
    try {
      await api('/api/admin/time', { method: 'POST', body: { task: id, date: log.date, minutes, note: log.note, billable: log.billable } })
      setLog({ ...log, hours: '', minutes: '', note: '' })
      notify('Time logged.')
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  const deleteLog = async (logId: string) => {
    if (!window.confirm('Delete this time entry?')) return
    try {
      await api(`/api/admin/time/${logId}`, { method: 'DELETE' })
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  const addComment = async () => {
    if (!comment.trim()) return
    try {
      const res = await api<{ comment: Comment }>(`/api/admin/tasks/${id}/comments`, { method: 'POST', body: { text: comment } })
      setComments((c) => [...c, res.comment])
      setComment('')
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  const project = projectMap.get(task.project)
  const timerHere = timer?.task === id
  const pct = task.estimateHours ? Math.min(100, Math.round((task.loggedMinutes / 60 / task.estimateHours) * 100)) : 0
  const canDelete = manager || task.createdBy === me.id

  return (
    <div>
      <Header title={`${task.number ? `TR-${task.number} · ` : ''}${project ? project.name : 'Task'}`} onClose={closeTaskDrawer} />
      <div className="space-y-6 p-5">
        {/* Time summary + timer */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Clock className="h-4 w-4 text-indigo-400" />
              <span className="font-semibold text-white">{fmtMinutes(task.loggedMinutes)}</span> logged
              {task.estimateHours ? <span className="text-zinc-500"> of {task.estimateHours}h estimate</span> : null}
            </div>
            {task.estimateHours > 0 && (
              <div className="mt-2 h-1.5 w-56 overflow-hidden rounded-full bg-zinc-800">
                <div className={`h-full ${pct >= 100 ? 'bg-rose-500' : pct > 80 ? 'bg-amber-400' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }} />
              </div>
            )}
          </div>
          {timerHere ? (
            <Btn variant="danger" onClick={() => stopTimer()}>
              <Square className="h-3.5 w-3.5 fill-current" /> Stop timer
            </Btn>
          ) : (
            <Btn variant="primary" onClick={() => startTimer({ task: id })}>
              <Play className="h-3.5 w-3.5 fill-current" /> Start timer
            </Btn>
          )}
        </div>

        <TaskFields form={form} setForm={setForm} canAssignOthers={manager} allowProjectChange={manager} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {canDelete && (
              <Btn variant="ghost" size="sm" onClick={remove} className="text-rose-400 hover:text-rose-300">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Btn>
            )}
            {task.link && (
              <a href={task.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:underline">
                <ExternalLink className="h-3 w-3" /> Open link
              </a>
            )}
          </div>
          <Btn variant="primary" onClick={save} busy={busy} disabled={!dirty || !form.title.trim()}>
            Save changes
          </Btn>
        </div>

        {task.number && (
          <p className="rounded-lg bg-zinc-950/60 px-3 py-2 text-[11px] text-zinc-500">
            Mention <code className="text-indigo-300">TR-{task.number}</code> in a commit message or pull request title and it appears here automatically (GitHub webhook).
          </p>
        )}

        {/* Log time manually */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Log time</h3>
          <div className="grid gap-2 sm:grid-cols-[130px_70px_70px_1fr_auto]">
            <input type="date" className={inputCls} value={log.date} max={isoDay()} onChange={(e) => setLog({ ...log, date: e.target.value })} aria-label="Date" />
            <input type="number" min={0} max={24} className={inputCls} placeholder="h" value={log.hours} onChange={(e) => setLog({ ...log, hours: e.target.value })} aria-label="Hours" />
            <input type="number" min={0} max={59} className={inputCls} placeholder="m" value={log.minutes} onChange={(e) => setLog({ ...log, minutes: e.target.value })} aria-label="Minutes" />
            <input className={inputCls} placeholder="What did you do?" value={log.note} onChange={(e) => setLog({ ...log, note: e.target.value })} aria-label="Note" />
            <Btn variant="outline" onClick={addLog}>
              Add
            </Btn>
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-400">
            <input type="checkbox" checked={log.billable} onChange={(e) => setLog({ ...log, billable: e.target.checked })} className="rounded border-zinc-700 bg-zinc-900" />
            Billable to the client
          </label>
          {logs.length > 0 && (
            <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800">
              {logs.map((l) => {
                const u = userMap.get(l.user)
                return (
                  <li key={l.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                    <Avatar user={u} size={22} />
                    <span className="w-16 shrink-0 text-xs text-zinc-500">{fmtDate(l.date)}</span>
                    <span className="w-16 shrink-0 font-medium text-zinc-100">{l.running ? 'running' : fmtMinutes(l.minutes)}</span>
                    <span className="min-w-0 flex-1 truncate text-zinc-400">{l.note || <span className="text-zinc-600">—</span>}</span>
                    {!l.billable && <span className="text-[10px] uppercase text-zinc-500">non-billable</span>}
                    {!l.running && (l.user === me.id || manager) && (
                      <button onClick={() => deleteLog(l.id)} className="text-zinc-500 hover:text-rose-400" aria-label="Delete entry">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Comments */}
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <MessageSquare className="h-4 w-4 text-zinc-400" /> Discussion
          </h3>
          {comments.map((c) => {
            const u = c.user ? userMap.get(c.user) : undefined
            const name = u?.name ?? c.authorName ?? 'Former member'
            return (
              <div key={c.id} className="flex gap-3">
                <Avatar user={u ?? { name, color: '#3f3f46' }} size={26} />
                <div className="min-w-0 flex-1 rounded-lg bg-zinc-950/70 px-3 py-2">
                  <div className="text-xs text-zinc-500">
                    <span className="font-medium text-zinc-300">{name}</span> ·{' '}
                    {new Date(c.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-200">{c.text}</p>
                </div>
              </div>
            )
          })}
          <div className="flex gap-2">
            <textarea
              className={`${inputCls} min-h-[44px]`}
              placeholder="Write an update or question…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addComment()
              }}
            />
            <Btn variant="outline" onClick={addComment} disabled={!comment.trim()}>
              Post
            </Btn>
          </div>
        </section>
      </div>
    </div>
  )
}
