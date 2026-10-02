'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import { Check, CheckCircle2, Copy, ExternalLink, Eye, EyeOff, FileText, FolderKanban, Link2, MessageCircle, Plus, Printer, Send, Star, Trash2, Upload, X } from 'lucide-react'
import { useWorkspace } from './context'
import {
  api, CHANGE_STATUS, copyText, dayOnly, fmtBytes, fmtDate, fmtHours, HEALTH, inr, INVOICE_STATUS, isManager, MILESTONE_STATUS, STAGES, whatsappLink,
  type ChangeRequest, type Invoice, type Milestone, type ProjectFile, type ProjectStage,
} from './lib'
import { Avatar, AvatarStack, Btn, Drawer, Empty, Field, inputCls, Loading, Modal, Pill } from './ui'

type Detail = {
  id: string
  onboarding: { key: string; label: string; done: boolean; doneAt?: string }[]
}
type LinkRow = { id: string; kind: 'portal' | 'review' | 'proposal'; name: string; email: string; createdAt: string; expiresAt: string; lastSeenAt: string | null; usedAt: string | null; state: string }

const TABS = ['overview', 'milestones', 'changes', 'invoices', 'files', 'client'] as const
type Tab = (typeof TABS)[number]
const TAB_LABEL: Record<Tab, string> = { overview: 'Overview', milestones: 'Milestones', changes: 'Change requests', invoices: 'Invoices', files: 'Files', client: 'Client access' }

/** Full project workspace: stage, onboarding, milestones, changes, invoices, files and client links. */
export function ProjectDetail({ projectId, onClose, onOpenBoard }: { projectId: string | null; onClose: () => void; onOpenBoard: (id: string) => void }) {
  return (
    <Drawer open={!!projectId} onClose={onClose}>
      {projectId && <Inner key={projectId} id={projectId} onClose={onClose} onOpenBoard={onOpenBoard} />}
    </Drawer>
  )
}

function Inner({ id, onClose, onOpenBoard }: { id: string; onClose: () => void; onOpenBoard: (id: string) => void }) {
  const { me, projectMap, userMap, notify, bump, version, refreshProjects } = useWorkspace()
  const manager = isManager(me)
  const project = projectMap.get(id)
  const [tab, setTab] = useState<Tab>('overview')
  const [detail, setDetail] = useState<Detail | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [changes, setChanges] = useState<ChangeRequest[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [links, setLinks] = useState<LinkRow[]>([])

  const load = useCallback(async () => {
    try {
      const [d, m, c, f] = await Promise.all([
        api<{ project: Detail }>(`/api/admin/projects/${id}`),
        api<{ milestones: Milestone[] }>(`/api/admin/projects/${id}/milestones`),
        api<{ changes: ChangeRequest[] }>(`/api/admin/projects/${id}/changes`),
        api<{ files: ProjectFile[] }>(`/api/admin/projects/${id}/files`),
      ])
      setDetail(d.project)
      setMilestones(m.milestones)
      setChanges(c.changes)
      setFiles(f.files)
      if (manager) {
        const [i, l] = await Promise.all([api<{ invoices: Invoice[] }>(`/api/admin/invoices?project=${id}`), api<{ links: LinkRow[] }>(`/api/admin/projects/${id}/links`)])
        setInvoices(i.invoices)
        setLinks(l.links)
      }
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }, [id, manager, notify])
  useEffect(() => {
    load()
  }, [load, version])

  if (!project || !detail) {
    return <div className="p-8"><Loading /></div>
  }

  const patchProject = async (body: Record<string, unknown>, msg = 'Saved.') => {
    try {
      await api(`/api/admin/projects/${id}`, { method: 'PATCH', body })
      notify(msg)
      await refreshProjects()
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  const tabs = TABS.filter((t) => manager || (t !== 'invoices' && t !== 'client'))
  const pendingChanges = changes.filter((c) => c.status === 'submitted').length
  const unpaid = invoices.filter((i) => i.status === 'sent').length

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 px-5 pt-4 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-white">{project.name}</h2>
            <p className="text-xs text-zinc-500">
              {project.client || 'Internal'}
              {project.value ? ` · ${inr(project.value)} contract` : ''}
              {project.dueDate ? ` · due ${fmtDate(project.dueDate, { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Btn size="sm" variant="outline" onClick={() => onOpenBoard(id)}>
              <FolderKanban className="h-3.5 w-3.5" /> Tasks
            </Btn>
            <button onClick={onClose} className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium ${tab === t ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>
              {TAB_LABEL[t]}
              {t === 'changes' && pendingChanges > 0 && <span className="ml-1 rounded-full bg-sky-600 px-1.5 text-[10px] text-white">{pendingChanges}</span>}
              {t === 'invoices' && unpaid > 0 && <span className="ml-1 rounded-full bg-amber-600 px-1.5 text-[10px] text-white">{unpaid}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5 p-5">
        {tab === 'overview' && (
          <Overview project={project} detail={detail} manager={manager} patchProject={patchProject} onChecklist={async (key: string, done: boolean) => {
            try {
              const r = await api<{ onboarding: Detail['onboarding'] }>(`/api/admin/projects/${id}/onboarding`, { method: 'PATCH', body: { key, done } })
              setDetail({ ...detail, onboarding: r.onboarding })
              refreshProjects()
            } catch (e: any) {
              notify(e.message, 'error')
            }
          }} onAddChecklist={async (label: string) => {
            try {
              const r = await api<{ onboarding: Detail['onboarding'] }>(`/api/admin/projects/${id}/onboarding`, { method: 'PATCH', body: { key: `custom-${Date.now()}`, label } })
              setDetail({ ...detail, onboarding: r.onboarding })
            } catch (e: any) {
              notify(e.message, 'error')
            }
          }} milestones={milestones} userMap={userMap} />
        )}
        {tab === 'milestones' && <Milestones projectId={id} list={milestones} manager={manager} value={project.value} reload={load} />}
        {tab === 'changes' && <Changes projectId={id} list={changes} manager={manager} reload={load} />}
        {tab === 'invoices' && manager && <ProjectInvoices projectId={id} list={invoices} milestones={milestones} reload={load} />}
        {tab === 'files' && <Files projectId={id} list={files} manager={manager} reload={load} />}
        {tab === 'client' && manager && <ClientAccess projectId={id} projectName={project.name} links={links} reload={load} stage={project.stage} />}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
function Overview({ project, detail, manager, patchProject, onChecklist, onAddChecklist, milestones, userMap }: any) {
  const [newItem, setNewItem] = useState('')
  const [staging, setStaging] = useState(project.stagingUrl ?? '')
  const [value, setValue] = useState(String(project.value ?? 0))
  const stageIdx = STAGES.findIndex((s) => s.id === project.stage)
  const done = detail.onboarding.filter((o: any) => o.done).length
  const approved = milestones.filter((m: Milestone) => m.status === 'approved').length
  const pct = project.stats.tasks ? Math.round((project.stats.done / project.stats.tasks) * 100) : 0

  return (
    <>
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Stage</h3>
        <div className="flex flex-wrap gap-1">
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              disabled={!manager}
              onClick={() => s.id !== project.stage && patchProject({ stage: s.id as ProjectStage }, `Moved to ${s.label}.`)}
              className={`flex-1 whitespace-nowrap rounded-md px-2 py-2 text-xs font-medium transition-colors ${i < stageIdx ? 'bg-indigo-900/50 text-indigo-200' : i === stageIdx ? 'bg-indigo-600 text-white' : 'bg-zinc-800/60 text-zinc-500 hover:text-zinc-300'} disabled:cursor-default`}
            >
              {i < stageIdx && <Check className="mr-1 inline h-3 w-3" />}
              {s.label}
            </button>
          ))}
        </div>
        {project.warrantyEndsAt && (project.stage === 'support' || project.stage === 'closed') && <p className="mt-2 text-xs text-emerald-300">Delivered {fmtDate(project.deliveredAt)} · support until {fmtDate(project.warrantyEndsAt, { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
      </section>

      <section className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
          <div className="text-[11px] uppercase text-zinc-500">Health</div>
          {manager ? (
            <select className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100" value={project.health} onChange={(e) => patchProject({ health: e.target.value })}>
              {Object.entries(HEALTH).map(([k, v]) => (
                <option key={k} value={k}>
                  {(v as any).label}
                </option>
              ))}
            </select>
          ) : (
            <Pill className={HEALTH[project.health].cls}>{HEALTH[project.health].label}</Pill>
          )}
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
          <div className="text-[11px] uppercase text-zinc-500">Tasks</div>
          <div className="mt-1 text-lg font-semibold text-white">{pct}%</div>
          <div className="text-[11px] text-zinc-500">{project.stats.done}/{project.stats.tasks} done{project.stats.overdue ? ` · ${project.stats.overdue} overdue` : ''}</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
          <div className="text-[11px] uppercase text-zinc-500">Hours</div>
          <div className="mt-1 text-lg font-semibold text-white">{fmtHours(project.stats.loggedMinutes)}h</div>
          <div className="text-[11px] text-zinc-500">{project.budgetHours ? `of ${project.budgetHours}h budget` : 'no budget set'}</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
          <div className="text-[11px] uppercase text-zinc-500">Milestones</div>
          <div className="mt-1 text-lg font-semibold text-white">{approved}/{milestones.length}</div>
          <div className="text-[11px] text-zinc-500">approved by client</div>
        </div>
      </section>

      {manager && (
        <section className="grid gap-3 sm:grid-cols-2">
          <Field label="Contract value (₹, before GST)" hint="Milestone invoices are calculated from this.">
            <div className="flex gap-2">
              <input type="number" min={0} className={inputCls} value={value} onChange={(e) => setValue(e.target.value)} />
              <Btn variant="outline" onClick={() => patchProject({ value: Number(value || 0) })} disabled={Number(value) === project.value}>Save</Btn>
            </div>
          </Field>
          <Field label="Staging / preview URL" hint="Shown to the client in their portal for testing.">
            <div className="flex gap-2">
              <input className={inputCls} value={staging} onChange={(e) => setStaging(e.target.value)} placeholder="https://staging.client.com" />
              <Btn variant="outline" onClick={() => patchProject({ stagingUrl: staging.trim() })} disabled={staging === (project.stagingUrl ?? '')}>Save</Btn>
            </div>
          </Field>
        </section>
      )}

      <section>
        <h3 className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <span>Onboarding checklist</span>
          <span className={done === detail.onboarding.length ? 'text-emerald-400' : ''}>{done}/{detail.onboarding.length}</span>
        </h3>
        <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800">
          {detail.onboarding.map((o: any) => (
            <li key={o.key} className="flex items-center gap-3 px-3 py-2 text-sm">
              <input type="checkbox" checked={o.done} disabled={!manager} onChange={(e) => onChecklist(o.key, e.target.checked)} className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600" aria-label={o.label} />
              <span className={`flex-1 ${o.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{o.label}</span>
              {o.done && o.doneAt && <span className="text-[10px] text-zinc-600">{fmtDate(o.doneAt)}</span>}
            </li>
          ))}
        </ul>
        {manager && (
          <div className="mt-2 flex gap-2">
            <input className={inputCls} placeholder="Add a checklist item" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
            <Btn variant="outline" disabled={newItem.trim().length < 2} onClick={() => { onAddChecklist(newItem.trim()); setNewItem('') }}>Add</Btn>
          </div>
        )}
        <p className="mt-2 text-[11px] text-zinc-600">Keep passwords and server access in your password manager, not here.</p>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Team</h3>
        <div className="flex items-center gap-3 text-sm text-zinc-300">
          {project.lead && (
            <span className="flex items-center gap-1.5"><Avatar user={userMap.get(project.lead)} size={24} /> {userMap.get(project.lead)?.name} (lead)</span>
          )}
          <AvatarStack ids={project.members.filter((m: string) => m !== project.lead)} users={userMap} max={8} />
        </div>
      </section>
    </>
  )
}

/* ------------------------------------------------------------------ */
function Milestones({ projectId, list, manager, value, reload }: { projectId: string; list: Milestone[]; manager: boolean; value: number; reload: () => void }) {
  const { notify, bump } = useWorkspace()
  const [form, setForm] = useState<null | { id?: string; title: string; description: string; dueDate: string; percent: string }>(null)
  const total = list.reduce((s, m) => s + m.percent, 0)

  const save = async () => {
    if (!form) return
    const body = { title: form.title, description: form.description, dueDate: form.dueDate || null, percent: Number(form.percent || 0) }
    try {
      if (form.id) await api(`/api/admin/milestones/${form.id}`, { method: 'PATCH', body })
      else await api(`/api/admin/projects/${projectId}/milestones`, { method: 'POST', body })
      setForm(null)
      reload()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }
  const setStatus = async (m: Milestone, status: Milestone['status']) => {
    try {
      await api(`/api/admin/milestones/${m.id}`, { method: 'PATCH', body: { status } })
      notify(status === 'ready_for_uat' ? 'Marked ready. The client can approve it in their portal.' : 'Updated.')
      reload()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }
  const invoice = async (m: Milestone) => {
    try {
      await api('/api/admin/invoices', { method: 'POST', body: { project: projectId, milestone: m.id } })
      notify('Draft invoice created — see the Invoices tab.')
      reload()
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }
  const remove = async (m: Milestone) => {
    if (!window.confirm(`Remove milestone “${m.title}”? Its tasks stay on the board.`)) return
    try {
      await api(`/api/admin/milestones/${m.id}`, { method: 'DELETE' })
      reload()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">
          Billing split: <span className={total === 100 ? 'text-emerald-400' : 'text-amber-300'}>{total}%</span> of {inr(value)}. Link tasks to a milestone from the task drawer.
        </p>
        {manager && (
          <Btn size="sm" variant="primary" onClick={() => setForm({ title: '', description: '', dueDate: '', percent: '0' })}>
            <Plus className="h-3.5 w-3.5" /> Milestone
          </Btn>
        )}
      </div>
      {!list.length ? (
        <Empty title="No milestones yet." />
      ) : (
        list.map((m) => (
          <div key={m.id} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <button className="min-w-0 text-left" disabled={!manager} onClick={() => setForm({ id: m.id, title: m.title, description: m.description, dueDate: dayOnly(m.dueDate), percent: String(m.percent) })}>
                <div className="font-medium text-zinc-100">{m.title}</div>
                <div className="text-[11px] text-zinc-500">
                  {m.percent}% · {inr((value * m.percent) / 100)}
                  {m.dueDate ? ` · due ${fmtDate(m.dueDate)}` : ''} · tasks {m.tasksDone}/{m.tasks}
                </div>
              </button>
              <Pill className={MILESTONE_STATUS[m.status].cls}>{MILESTONE_STATUS[m.status].label}</Pill>
            </div>
            {m.clientDecisionBy && (
              <p className="mt-2 rounded bg-zinc-900 px-2 py-1.5 text-xs text-zinc-400">
                {m.status === 'approved' ? 'Approved' : 'Changes requested'} by {m.clientDecisionBy} on {fmtDate(m.clientDecisionAt)}
                {m.clientNote && <span className="block text-zinc-300">“{m.clientNote}”</span>}
              </p>
            )}
            {manager && (
              <div className="mt-2 flex flex-wrap gap-1">
                {(m.status === 'pending' || m.status === 'changes_requested') && <Btn size="sm" variant="ghost" onClick={() => setStatus(m, 'in_progress')}>Start</Btn>}
                {(m.status === 'in_progress' || m.status === 'changes_requested') && (
                  <Btn size="sm" variant="outline" onClick={() => setStatus(m, 'ready_for_uat')}>
                    <Send className="h-3 w-3" /> Ready for client testing
                  </Btn>
                )}
                {m.status === 'ready_for_uat' && <Btn size="sm" variant="ghost" title="Client approved offline" onClick={() => setStatus(m, 'approved')}><Check className="h-3 w-3" /> Mark approved</Btn>}
                {m.percent > 0 && <Btn size="sm" variant="ghost" onClick={() => invoice(m)}><FileText className="h-3 w-3" /> Create invoice</Btn>}
                <Btn size="sm" variant="ghost" className="text-zinc-500" onClick={() => remove(m)} aria-label="Remove"><Trash2 className="h-3 w-3" /></Btn>
              </div>
            )}
          </div>
        ))
      )}
      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? 'Edit milestone' : 'New milestone'} footer={<><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn><Btn variant="primary" onClick={save} disabled={!form || form.title.trim().length < 2}>Save</Btn></>}>
        {form && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title" className="sm:col-span-2"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Due date"><input type="date" className={inputCls} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></Field>
            <Field label="% of contract billed"><input type="number" min={0} max={100} className={inputCls} value={form.percent} onChange={(e) => setForm({ ...form, percent: e.target.value })} /></Field>
            <Field label="What the client gets (shown in portal)" className="sm:col-span-2"><textarea className={`${inputCls} min-h-[80px]`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
function Changes({ projectId, list, manager, reload }: { projectId: string; list: ChangeRequest[]; manager: boolean; reload: () => void }) {
  const { notify, openTask } = useWorkspace()
  const [form, setForm] = useState<null | { title: string; description: string }>(null)
  const [est, setEst] = useState<null | { id: string; estimateHours: string; cost: string; daysAdded: string }>(null)

  const create = async () => {
    if (!form) return
    try {
      await api(`/api/admin/projects/${projectId}/changes`, { method: 'POST', body: form })
      setForm(null)
      reload()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }
  const patch = async (id: string, body: Record<string, unknown>, msg = 'Updated.') => {
    try {
      await api(`/api/admin/changes/${id}`, { method: 'PATCH', body })
      notify(msg)
      reload()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">Extra work outside scope: estimate it, the client approves cost and time in their portal, then it becomes a task.</p>
        <Btn size="sm" variant="primary" onClick={() => setForm({ title: '', description: '' })}><Plus className="h-3.5 w-3.5" /> Change</Btn>
      </div>
      {!list.length ? (
        <Empty title="No change requests." />
      ) : (
        list.map((c) => (
          <div key={c.id} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-medium text-zinc-100">{c.title}</div>
                <div className="text-[11px] text-zinc-500">
                  {c.source === 'client' ? 'From client' : 'Logged by team'} · {c.requesterName} · {fmtDate(c.createdAt)}
                </div>
              </div>
              <Pill className={CHANGE_STATUS[c.status].cls}>{CHANGE_STATUS[c.status].label}</Pill>
            </div>
            {c.description && <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-400">{c.description}</p>}
            {(c.cost > 0 || c.estimateHours > 0) && (
              <p className="mt-2 text-xs text-zinc-300">Estimate: {c.estimateHours}h · {inr(c.cost)} · +{c.daysAdded} days</p>
            )}
            {c.decidedBy && <p className="mt-1 text-[11px] text-zinc-500">Decided by {c.decidedBy} on {fmtDate(c.decidedAt)}</p>}
            {manager && (
              <div className="mt-2 flex flex-wrap gap-1">
                {(c.status === 'submitted' || c.status === 'estimated') && (
                  <Btn size="sm" variant="outline" onClick={() => setEst({ id: c.id, estimateHours: String(c.estimateHours || ''), cost: String(c.cost || ''), daysAdded: String(c.daysAdded || '') })}>
                    {c.status === 'submitted' ? 'Estimate' : 'Edit estimate'}
                  </Btn>
                )}
                {c.status === 'estimated' && <Btn size="sm" variant="ghost" title="Client approved offline" onClick={() => patch(c.id, { status: 'approved' }, 'Approved — task created.')}><Check className="h-3 w-3" /> Approve</Btn>}
                {(c.status === 'submitted' || c.status === 'estimated') && <Btn size="sm" variant="ghost" className="text-zinc-500" onClick={() => patch(c.id, { status: 'rejected' })}>Decline</Btn>}
                {c.status === 'approved' && <Btn size="sm" variant="ghost" onClick={() => patch(c.id, { status: 'done' })}>Mark done</Btn>}
                {c.task && <Btn size="sm" variant="ghost" onClick={() => openTask(c.task!)}>Open task</Btn>}
              </div>
            )}
          </div>
        ))
      )}
      <Modal open={!!form} onClose={() => setForm(null)} title="New change request" footer={<><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn><Btn variant="primary" onClick={create} disabled={!form || form.title.trim().length < 2}>Save</Btn></>}>
        {form && (
          <div className="space-y-3">
            <Field label="What needs to change"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Details"><textarea className={`${inputCls} min-h-[90px]`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          </div>
        )}
      </Modal>
      <Modal open={!!est} onClose={() => setEst(null)} title="Estimate the change" footer={<><Btn variant="ghost" onClick={() => setEst(null)}>Cancel</Btn><Btn variant="primary" onClick={() => { if (est) { patch(est.id, { estimateHours: Number(est.estimateHours || 0), cost: Number(est.cost || 0), daysAdded: Number(est.daysAdded || 0) }, 'Estimate saved. The client can now approve it in their portal.'); setEst(null) } }}>Save estimate</Btn></>}>
        {est && (
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Hours"><input type="number" min={0} className={inputCls} value={est.estimateHours} onChange={(e) => setEst({ ...est, estimateHours: e.target.value })} /></Field>
            <Field label="Cost (₹)"><input type="number" min={0} className={inputCls} value={est.cost} onChange={(e) => setEst({ ...est, cost: e.target.value })} /></Field>
            <Field label="Extra days"><input type="number" min={0} className={inputCls} value={est.daysAdded} onChange={(e) => setEst({ ...est, daysAdded: e.target.value })} /></Field>
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
export function InvoiceActions({ inv, reload }: { inv: Invoice; reload: () => void }) {
  const { notify, bump } = useWorkspace()
  const act = async (action: string, extra: Record<string, unknown> = {}) => {
    try {
      await api(`/api/admin/invoices/${inv.id}`, { method: 'PATCH', body: { action, ...extra } })
      reload()
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }
  const payLink = async () => {
    try {
      await api(`/api/admin/invoices/${inv.id}/payment-link`, { method: 'POST' })
      notify('Razorpay payment link created.')
      reload()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }
  const remove = async () => {
    if (!window.confirm(`Delete draft ${inv.number}?`)) return
    try {
      await api(`/api/admin/invoices/${inv.id}`, { method: 'DELETE' })
      reload()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }
  return (
    <div className="flex flex-wrap justify-end gap-1">
      <a href={`/admin/invoices/${inv.id}`} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-zinc-300 hover:bg-zinc-800" title="Print / PDF">
        <Printer className="h-3.5 w-3.5" />
      </a>
      {inv.status === 'draft' && <Btn size="sm" variant="outline" onClick={() => act('send')}>Mark sent</Btn>}
      {(inv.status === 'draft' || inv.status === 'sent') && !inv.paymentLink && <Btn size="sm" variant="ghost" onClick={payLink} title="Needs Razorpay keys">Razorpay link</Btn>}
      {inv.paymentLink && inv.status === 'sent' && (
        <Btn size="sm" variant="ghost" onClick={() => notify(copyText(inv.paymentLink) ? 'Payment link copied.' : inv.paymentLink)}><Copy className="h-3 w-3" /> Pay link</Btn>
      )}
      {inv.status === 'sent' && (
        <Btn size="sm" variant="ghost" className="text-emerald-300" onClick={() => { const ref = window.prompt('Payment reference (UTR / cheque no.)', ''); if (ref !== null) act('paid', { paymentRef: ref }) }}>
          <CheckCircle2 className="h-3.5 w-3.5" /> Paid
        </Btn>
      )}
      {inv.status === 'sent' && <Btn size="sm" variant="ghost" className="text-zinc-500" onClick={() => act('cancel')}>Cancel</Btn>}
      {inv.status === 'draft' && <Btn size="sm" variant="ghost" className="text-zinc-500" onClick={remove} aria-label="Delete"><Trash2 className="h-3 w-3" /></Btn>}
    </div>
  )
}

function ProjectInvoices({ projectId, list, milestones, reload }: { projectId: string; list: Invoice[]; milestones: Milestone[]; reload: () => void }) {
  const { notify } = useWorkspace()
  const [form, setForm] = useState<null | { description: string; amount: string; gstPercent: string; dueDate: string }>(null)
  const billed = list.filter((i) => i.status !== 'cancelled').reduce((s, i) => s + i.total, 0)
  const paid = list.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0)
  const create = async () => {
    if (!form) return
    try {
      await api('/api/admin/invoices', { method: 'POST', body: { project: projectId, items: [{ description: form.description, quantity: 1, rate: Number(form.amount || 0) }], gstPercent: Number(form.gstPercent), dueDate: form.dueDate || null } })
      setForm(null)
      reload()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">Billed {inr(billed)} · received <span className="text-emerald-300">{inr(paid)}</span> · outstanding <span className="text-amber-300">{inr(billed - paid)}</span> (incl. GST)</p>
        <Btn size="sm" variant="primary" onClick={() => setForm({ description: '', amount: '', gstPercent: '18', dueDate: '' })}><Plus className="h-3.5 w-3.5" /> Invoice</Btn>
      </div>
      {!list.length ? (
        <Empty title="No invoices yet.">Create one from a milestone (Milestones tab) or here.</Empty>
      ) : (
        <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800">
          {list.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center gap-3 px-3 py-2.5 text-sm">
              <span className="min-w-0 flex-1">
                <span className="font-medium text-zinc-100">{i.number}</span> <span className="text-zinc-500">· {i.items[0]?.description}</span>
                <span className="block text-[11px] text-zinc-500">
                  {milestones.find((m) => m.id === i.milestone)?.title ?? 'Custom'}
                  {i.dueDate ? ` · due ${fmtDate(i.dueDate)}` : ''}
                  {i.paidAt ? ` · paid ${fmtDate(i.paidAt)}${i.paymentRef ? ` (${i.paymentRef})` : ''}` : ''}
                </span>
              </span>
              <span className="font-semibold text-zinc-100">{inr(i.total)}</span>
              <Pill className={INVOICE_STATUS[i.status].cls}>{INVOICE_STATUS[i.status].label}</Pill>
              <InvoiceActions inv={i} reload={reload} />
            </li>
          ))}
        </ul>
      )}
      <Modal open={!!form} onClose={() => setForm(null)} title="New invoice" footer={<><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn><Btn variant="primary" onClick={create} disabled={!form?.description || !Number(form?.amount)}>Create draft</Btn></>}>
        {form && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Description" className="sm:col-span-2"><input className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Hosting & maintenance — Oct 2026" /></Field>
            <Field label="Amount (₹, before GST)"><input type="number" min={0} className={inputCls} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></Field>
            <Field label="GST %"><select className={inputCls} value={form.gstPercent} onChange={(e) => setForm({ ...form, gstPercent: e.target.value })}>{[0, 5, 12, 18, 28].map((g) => <option key={g} value={g}>{g}%</option>)}</select></Field>
            <Field label="Due date"><input type="date" className={inputCls} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></Field>
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
function Files({ projectId, list, manager, reload }: { projectId: string; list: ProjectFile[]; manager: boolean; reload: () => void }) {
  const { me, userMap, notify } = useWorkspace()
  const [link, setLink] = useState<null | { title: string; url: string; kind: string; visibleToClient: boolean }>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const onPick = async (fl: FileList | null) => {
    if (!fl?.length) return
    for (const file of Array.from(fl)) {
      setUploading(file.name)
      try {
        const safe = file.name.replace(/[^\w.\-]+/g, '-')
        const blob = await upload(`projects/${projectId}/${safe}`, file, { access: 'public', handleUploadUrl: '/api/admin/blob/upload', clientPayload: JSON.stringify({ project: projectId }) })
        await api(`/api/admin/projects/${projectId}/files`, { method: 'POST', body: { title: file.name, url: blob.url, kind: file.type.startsWith('image/') ? 'design' : 'document', stored: true, size: file.size, contentType: file.type } })
      } catch (e: any) {
        notify(`${file.name}: ${e.message}`, 'error')
      }
    }
    setUploading(null)
    if (fileRef.current) fileRef.current.value = ''
    reload()
  }
  const addLink = async () => {
    if (!link) return
    try {
      await api(`/api/admin/projects/${projectId}/files`, { method: 'POST', body: link })
      setLink(null)
      reload()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }
  const toggle = async (f: ProjectFile) => {
    try {
      await api(`/api/admin/files/${f.id}`, { method: 'PATCH', body: { visibleToClient: !f.visibleToClient } })
      reload()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }
  const remove = async (f: ProjectFile) => {
    if (!window.confirm(`Remove “${f.title}”?${f.stored ? ' The uploaded file is deleted.' : ''}`)) return
    try {
      await api(`/api/admin/files/${f.id}`, { method: 'DELETE' })
      reload()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-zinc-500">Uploads go to Vercel Blob. Eye icon = the client can see it in their portal.</p>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => onPick(e.target.files)} />
          <Btn size="sm" variant="primary" busy={!!uploading} onClick={() => fileRef.current?.click()}><Upload className="h-3.5 w-3.5" /> {uploading ? `Uploading ${uploading.slice(0, 18)}…` : 'Upload'}</Btn>
          <Btn size="sm" variant="outline" onClick={() => setLink({ title: '', url: '', kind: 'document', visibleToClient: false })}><Link2 className="h-3.5 w-3.5" /> Add link</Btn>
        </div>
      </div>
      {!list.length ? (
        <Empty title="No files yet.">Upload briefs, designs and builds, or link Google Drive / Figma.</Empty>
      ) : (
        <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800">
          {list.map((f) => (
            <li key={f.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
              {f.stored ? <FileText className="h-4 w-4 shrink-0 text-indigo-300" /> : <Link2 className="h-4 w-4 shrink-0 text-zinc-500" />}
              <a href={f.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 hover:underline">
                <span className="block truncate text-zinc-100">{f.title}</span>
                <span className="block text-[11px] text-zinc-500">
                  {f.kind}
                  {f.size ? ` · ${fmtBytes(f.size)}` : ''} · {f.addedByClient ? `from client (${f.addedByClient})` : userMap.get(f.addedBy ?? '')?.name ?? 'team'} · {fmtDate(f.createdAt)}
                </span>
              </a>
              {manager ? (
                <button onClick={() => toggle(f)} className={f.visibleToClient ? 'text-emerald-400' : 'text-zinc-600 hover:text-zinc-300'} title={f.visibleToClient ? 'Visible to client' : 'Team only'} aria-label="Toggle client visibility">
                  {f.visibleToClient ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              ) : null}
              {(manager || f.addedBy === me.id) && (
                <button onClick={() => remove(f)} className="text-zinc-600 hover:text-rose-400" aria-label="Remove"><Trash2 className="h-3.5 w-3.5" /></button>
              )}
            </li>
          ))}
        </ul>
      )}
      <Modal open={!!link} onClose={() => setLink(null)} title="Add a link" footer={<><Btn variant="ghost" onClick={() => setLink(null)}>Cancel</Btn><Btn variant="primary" onClick={addLink} disabled={!link?.title || !link?.url}>Add</Btn></>}>
        {link && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title"><input className={inputCls} value={link.title} onChange={(e) => setLink({ ...link, title: e.target.value })} /></Field>
            <Field label="Type"><select className={inputCls} value={link.kind} onChange={(e) => setLink({ ...link, kind: e.target.value })}>{['brief', 'design', 'build', 'document', 'other'].map((k) => <option key={k}>{k}</option>)}</select></Field>
            <Field label="URL" className="sm:col-span-2"><input className={inputCls} value={link.url} onChange={(e) => setLink({ ...link, url: e.target.value })} placeholder="https://drive.google.com/…" /></Field>
            {manager && (
              <label className="flex items-center gap-2 text-sm text-zinc-300 sm:col-span-2">
                <input type="checkbox" checked={link.visibleToClient} onChange={(e) => setLink({ ...link, visibleToClient: e.target.checked })} className="rounded border-zinc-700 bg-zinc-900" /> Show to client in portal
              </label>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
function ClientAccess({ projectId, projectName, links, reload, stage }: { projectId: string; projectName: string; links: LinkRow[]; reload: () => void; stage: string }) {
  const { notify } = useWorkspace()
  const [form, setForm] = useState<null | { kind: 'portal' | 'review'; name: string; email: string; sendEmail: boolean }>(null)
  const [created, setCreated] = useState<null | { url: string; kind: string; emailed: boolean }>(null)

  const create = async () => {
    if (!form) return
    try {
      const r = await api<{ url: string; emailed: boolean }>(`/api/admin/projects/${projectId}/links`, { method: 'POST', body: form })
      setCreated({ url: r.url, kind: form.kind, emailed: r.emailed })
      setForm(null)
      reload()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }
  const revoke = async (l: LinkRow) => {
    if (!window.confirm('Revoke this link? It stops working immediately.')) return
    try {
      await api(`/api/admin/links/${l.id}`, { method: 'DELETE' })
      reload()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }
  const msg = created
    ? created.kind === 'portal'
      ? `Hi! Here is your private TechRover portal for ${projectName}. Track progress, approve milestones, request changes and see invoices: ${created.url}`
      : `Hi! Thank you for working with TechRover on ${projectName}. Would you leave us a quick review? It takes 2 minutes: ${created.url}`
    : ''

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
          <div className="font-medium text-zinc-100">Client portal link</div>
          <p className="mt-1 text-xs text-zinc-500">Private link, valid 180 days. The client sees progress, milestones, change requests, invoices and shared files, and can upload assets.</p>
          <Btn size="sm" variant="primary" className="mt-3" onClick={() => setForm({ kind: 'portal', name: '', email: '', sendEmail: false })}><Link2 className="h-3.5 w-3.5" /> Create portal link</Btn>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
          <div className="font-medium text-zinc-100">Review request</div>
          <p className="mt-1 text-xs text-zinc-500">One-time link, 14 days. 4–5★ reviews go to your approval queue; 3★ or less come privately to the owner.</p>
          <Btn size="sm" variant={stage === 'support' || stage === 'closed' ? 'primary' : 'outline'} className="mt-3" onClick={() => setForm({ kind: 'review', name: '', email: '', sendEmail: false })}><Star className="h-3.5 w-3.5" /> Request a review</Btn>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Links shared</h3>
        {!links.length ? (
          <p className="text-xs text-zinc-500">None yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800 text-sm">
            {links.map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-3 py-2">
                <span className="w-16 shrink-0 text-xs capitalize text-zinc-400">{l.kind}</span>
                <span className="min-w-0 flex-1 truncate text-zinc-200">
                  {l.name || l.email || 'Client'}
                  <span className="block text-[11px] text-zinc-500">
                    created {fmtDate(l.createdAt)} · {l.lastSeenAt ? `last opened ${fmtDate(l.lastSeenAt)}` : 'not opened yet'}
                    {l.usedAt ? ` · used ${fmtDate(l.usedAt)}` : ''}
                  </span>
                </span>
                <Pill className={l.state === 'active' ? 'border-emerald-800 text-emerald-300' : 'border-zinc-700 text-zinc-500'}>{l.state}</Pill>
                {l.state === 'active' && <Btn size="sm" variant="ghost" className="text-rose-300" onClick={() => revoke(l)}>Revoke</Btn>}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-[11px] text-zinc-600">For security, a link is shown only once when created. Lost it? Revoke and create a new one.</p>
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.kind === 'portal' ? 'Create portal link' : 'Request a review'} footer={<><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn><Btn variant="primary" onClick={create}>Create link</Btn></>}>
        {form && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Client contact name" hint="Defaults to the client's contact person."><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Email"><input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <label className="flex items-center gap-2 text-sm text-zinc-300 sm:col-span-2">
              <input type="checkbox" checked={form.sendEmail} onChange={(e) => setForm({ ...form, sendEmail: e.target.checked })} className="rounded border-zinc-700 bg-zinc-900" /> Also email it (needs Resend set up)
            </label>
          </div>
        )}
      </Modal>
      <Modal open={!!created} onClose={() => setCreated(null)} title="Link created" footer={<Btn variant="primary" onClick={() => setCreated(null)}>Done</Btn>}>
        {created && (
          <div className="space-y-3 text-sm text-zinc-300">
            <p>Copy it now — it won't be shown again.{created.emailed ? ' It was also emailed.' : ''}</p>
            <div className="flex gap-2">
              <input readOnly className={`${inputCls} font-mono text-xs`} value={created.url} onFocus={(e) => e.target.select()} />
              <Btn variant="outline" onClick={() => notify(copyText(created.url) ? 'Link copied.' : 'Copy it manually.')}><Copy className="h-3.5 w-3.5" /></Btn>
            </div>
            <div className="flex flex-wrap gap-2">
              <a className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500" target="_blank" rel="noreferrer" href={whatsappLink(msg)}><MessageCircle className="h-3.5 w-3.5" /> Share on WhatsApp</a>
              <a className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:underline" href={created.url} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" /> Open</a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
