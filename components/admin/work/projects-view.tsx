'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, CalendarDays, ExternalLink, FolderKanban, Pencil, Plus, Trash2 } from 'lucide-react'
import { useWorkspace } from './context'
import { api, dayOnly, fmtDate, fmtHours, HEALTH, isManager, PROJECT_STATUS, STAGES, type Project, type ProjectStatus } from './lib'
import { Avatar, AvatarStack, Btn, Empty, Field, inputCls, Modal, PeoplePicker, Pill } from './ui'

type Form = {
  name: string
  client: string
  description: string
  status: ProjectStatus
  startDate: string
  dueDate: string
  budgetHours: string
  lead: string
  members: string[]
  repoUrl: string
}

const blank: Form = { name: '', client: '', description: '', status: 'active', startDate: '', dueDate: '', budgetHours: '', lead: '', members: [], repoUrl: '' }

export function ProjectsView({ onOpenBoard, onOpenProject }: { onOpenBoard: (projectId: string) => void; onOpenProject: (projectId: string) => void }) {
  const { me, users, userMap, projects, refreshProjects, notify, bump } = useWorkspace()
  const [status, setStatus] = useState<'open' | ProjectStatus | 'all'>('open')
  const [editing, setEditing] = useState<Project | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Form>(blank)
  const [busy, setBusy] = useState(false)
  const manager = isManager(me)

  const list = useMemo(
    () =>
      projects.filter((p) =>
        status === 'all' ? true : status === 'open' ? p.status === 'active' || p.status === 'planning' || p.status === 'on_hold' : p.status === status
      ),
    [projects, status]
  )

  const openCreate = () => {
    setForm({ ...blank, lead: me.id, members: [me.id] })
    setEditing(null)
    setCreating(true)
  }
  const openEdit = (p: Project) => {
    setForm({
      name: p.name,
      client: p.client,
      description: p.description,
      status: p.status,
      startDate: dayOnly(p.startDate),
      dueDate: dayOnly(p.dueDate),
      budgetHours: p.budgetHours ? String(p.budgetHours) : '',
      lead: p.lead ?? '',
      members: p.members,
      repoUrl: p.repoUrl,
    })
    setEditing(p)
    setCreating(true)
  }

  const save = async () => {
    setBusy(true)
    const body = {
      ...form,
      startDate: form.startDate || null,
      dueDate: form.dueDate || null,
      budgetHours: Number(form.budgetHours || 0),
      lead: form.lead || null,
    }
    try {
      if (editing) await api(`/api/admin/projects/${editing.id}`, { method: 'PATCH', body })
      else await api('/api/admin/projects', { method: 'POST', body })
      notify(editing ? 'Project saved.' : 'Project created.')
      setCreating(false)
      await refreshProjects()
    } catch (e: any) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!editing) return
    if (!window.confirm(`Delete “${editing.name}” with all its tasks and time entries? To keep history, set the status to Cancelled instead.`)) return
    try {
      await api(`/api/admin/projects/${editing.id}`, { method: 'DELETE' })
      notify('Project deleted.')
      setCreating(false)
      await refreshProjects()
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-0.5">
          {(['open', 'completed', 'cancelled', 'all'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${status === s ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              {s === 'open' ? 'Open' : s === 'all' ? 'All' : PROJECT_STATUS[s].label}
            </button>
          ))}
        </div>
        {manager && (
          <Btn variant="primary" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" /> New project
          </Btn>
        )}
      </div>

      {!list.length ? (
        <Empty title={projects.length ? 'No projects with this status.' : 'No projects yet.'}>
          {manager ? 'Create a project, add the team, then break the work into tasks.' : 'A manager needs to add you to a project.'}
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => {
            const pct = p.stats.tasks ? Math.round((p.stats.done / p.stats.tasks) * 100) : 0
            const hours = p.stats.loggedMinutes / 60
            const budgetPct = p.budgetHours ? Math.round((hours / p.budgetHours) * 100) : 0
            const lead = p.lead ? userMap.get(p.lead) : null
            return (
              <div key={p.id} className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-xl">
                <div className="flex items-start justify-between gap-2">
                  <button className="min-w-0 text-left" onClick={() => onOpenProject(p.id)}>
                    <h3 className="truncate text-base font-semibold text-white hover:underline">{p.name}</h3>
                    <p className="truncate text-xs text-zinc-500">{p.client || 'Internal'}</p>
                  </button>
                  <div className="flex flex-col items-end gap-1">
                    <Pill className={PROJECT_STATUS[p.status].cls}>{PROJECT_STATUS[p.status].label}</Pill>
                    {p.health && p.health !== 'on_track' && <Pill className={HEALTH[p.health].cls}>{HEALTH[p.health].label}</Pill>}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {STAGES.map((s) => {
                    const idx = STAGES.findIndex((x) => x.id === (p.stage ?? 'onboarding'))
                    const i = STAGES.findIndex((x) => x.id === s.id)
                    return <span key={s.id} title={s.label} className={`h-1 flex-1 rounded-full ${i < idx ? 'bg-indigo-700' : i === idx ? 'bg-indigo-400' : 'bg-zinc-800'}`} />
                  })}
                </div>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Stage: <span className="text-zinc-300">{STAGES.find((x) => x.id === (p.stage ?? 'onboarding'))?.label}</span>
                  {p.onboardingTotal ? ` · onboarding ${p.onboardingDone}/${p.onboardingTotal}` : ''}
                </p>
                {p.description && <p className="mt-2 line-clamp-2 text-xs text-zinc-400">{p.description}</p>}

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>
                        Tasks {p.stats.done}/{p.stats.tasks} done
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                      <div className="h-full bg-indigo-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>
                        {fmtHours(p.stats.loggedMinutes)}h logged{p.budgetHours ? ` of ${p.budgetHours}h budget` : ''}
                      </span>
                      {p.budgetHours > 0 && <span className={budgetPct > 100 ? 'text-rose-400' : ''}>{budgetPct}%</span>}
                    </div>
                    {p.budgetHours > 0 && (
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                        <div className={`h-full ${budgetPct > 100 ? 'bg-rose-500' : budgetPct > 80 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, budgetPct)}%` }} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
                  {p.dueDate && (
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" /> Due {fmtDate(p.dueDate, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                  {p.stats.overdue > 0 && (
                    <span className="flex items-center gap-1 text-rose-400">
                      <AlertTriangle className="h-3 w-3" /> {p.stats.overdue} overdue
                    </span>
                  )}
                  {p.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-300 hover:underline">
                      <ExternalLink className="h-3 w-3" /> Repo
                    </a>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
                  <div className="flex items-center gap-2">
                    {lead && (
                      <span className="flex items-center gap-1.5 text-xs text-zinc-400" title="Project lead">
                        <Avatar user={lead} size={22} /> {lead.name.split(' ')[0]}
                      </span>
                    )}
                    <AvatarStack ids={p.members.filter((m) => m !== p.lead)} users={userMap} max={4} />
                  </div>
                  <div className="flex items-center gap-1">
                    {manager && (
                      <Btn variant="ghost" size="sm" onClick={() => openEdit(p)} aria-label="Edit project">
                        <Pencil className="h-3.5 w-3.5" />
                      </Btn>
                    )}
                    <Btn variant="ghost" size="sm" onClick={() => onOpenBoard(p.id)}>
                      <FolderKanban className="h-3.5 w-3.5" /> Tasks
                    </Btn>
                    <Btn variant="outline" size="sm" onClick={() => onOpenProject(p.id)}>
                      Open
                    </Btn>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title={editing ? 'Edit project' : 'New project'}
        wide
        footer={
          <div className="flex w-full items-center justify-between">
            <div>
              {editing && me.role === 'owner' && (
                <Btn variant="ghost" size="sm" onClick={remove} className="text-rose-400">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Btn>
              )}
            </div>
            <div className="flex gap-2">
              <Btn variant="ghost" onClick={() => setCreating(false)}>
                Cancel
              </Btn>
              <Btn variant="primary" onClick={save} busy={busy} disabled={form.name.trim().length < 2}>
                {editing ? 'Save' : 'Create project'}
              </Btn>
            </div>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Project name">
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
          </Field>
          <Field label="Client">
            <input className={inputCls} value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Company name" />
          </Field>
          <Field label="Status">
            <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}>
              {(Object.keys(PROJECT_STATUS) as ProjectStatus[]).map((s) => (
                <option key={s} value={s}>
                  {PROJECT_STATUS[s].label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Budget (hours)" hint="Logged time is compared against this.">
            <input type="number" min={0} className={inputCls} value={form.budgetHours} onChange={(e) => setForm({ ...form, budgetHours: e.target.value })} />
          </Field>
          <Field label="Start date">
            <input type="date" className={inputCls} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </Field>
          <Field label="Due date">
            <input type="date" className={inputCls} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </Field>
          <Field label="Project lead">
            <select className={inputCls} value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value, members: e.target.value && !form.members.includes(e.target.value) ? [...form.members, e.target.value] : form.members })}>
              <option value="">No lead</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Repository URL">
            <input className={inputCls} value={form.repoUrl} onChange={(e) => setForm({ ...form, repoUrl: e.target.value })} placeholder="https://github.com/techroverteam-ux/…" />
          </Field>
          <Field label="Team on this project" className="sm:col-span-2" hint="Team members only see projects they are on.">
            <PeoplePicker users={users} value={form.members} onChange={(ids) => setForm({ ...form, members: ids })} />
          </Field>
          <Field label="Description / scope" className="sm:col-span-2">
            <textarea className={`${inputCls} min-h-[100px]`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
