'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import { CheckCircle2, Circle, Download, ExternalLink, Upload } from 'lucide-react'
import { btn, call, Card, dt, inr, input, Notice, Shell } from '@/components/client/shell'

type Data = {
  viewer: { name: string }
  project: { name: string; client: string; stage: string; stageLabel: string; startDate: string | null; dueDate: string | null; stagingUrl: string; deliveredAt: string | null; warrantyEndsAt: string | null; progress: number; tasksDone: number; tasksTotal: number; onboarding: { label: string; done: boolean }[] }
  milestones: { id: string; title: string; description: string; dueDate: string | null; percent: number; status: string; clientDecisionAt: string | null; clientDecisionBy: string; clientNote: string; tasks: number; tasksDone: number }[]
  changes: { id: string; title: string; description: string; status: string; cost: number; daysAdded: number; estimateHours: number; source: string; createdAt: string }[]
  invoices: { id: string; number: string; total: number; status: string; dueDate: string | null; paidAt: string | null; paymentLink: string; items: { description: string }[] }[]
  files: { id: string; title: string; url: string; kind: string; size: number; fromClient: boolean; createdAt: string }[]
  uploadsEnabled: boolean
  projectId: string
}

const STAGES = [
  ['onboarding', 'Onboarding'],
  ['development', 'Development'],
  ['qa_uat', 'Testing'],
  ['delivery', 'Delivery'],
  ['support', 'Live'],
]
const M_LABEL: Record<string, [string, string]> = {
  pending: ['Not started', 'bg-slate-100 text-slate-600'],
  in_progress: ['In progress', 'bg-sky-100 text-sky-700'],
  ready_for_uat: ['Ready for your review', 'bg-violet-100 text-violet-700'],
  approved: ['Approved', 'bg-emerald-100 text-emerald-700'],
  changes_requested: ['Changes requested', 'bg-amber-100 text-amber-700'],
}
const C_LABEL: Record<string, [string, string]> = {
  submitted: ['We are estimating', 'bg-sky-100 text-sky-700'],
  estimated: ['Needs your decision', 'bg-violet-100 text-violet-700'],
  approved: ['Approved', 'bg-emerald-100 text-emerald-700'],
  rejected: ['Declined', 'bg-slate-100 text-slate-500'],
  done: ['Done', 'bg-indigo-100 text-indigo-700'],
}

export default function PortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [name, setName] = useState('')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [cr, setCr] = useState({ title: '', description: '' })
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(() => call<Data>(`/api/public/portal/${token}`).then((d) => { setData(d); setName((n) => n || d.viewer.name) }).catch((e) => setError(e.message)), [token])
  useEffect(() => { load() }, [load])

  const act = async (body: Record<string, unknown>, ok: string) => {
    if (name.trim().length < 2) return setError('Please type your name at the top first.')
    setBusy(true)
    setError('')
    try {
      await call(`/api/public/portal/${token}`, { ...body, name })
      setMsg(ok)
      await load()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const onFiles = async (fl: FileList | null) => {
    if (!fl?.length || !data) return
    if (name.trim().length < 2) return setError('Please type your name at the top first.')
    setError('')
    for (const file of Array.from(fl)) {
      setUploading(file.name)
      try {
        const safe = file.name.replace(/[^\w.\-]+/g, '-')
        const blob = await upload(`projects/${data.projectId}/client/${safe}`, file, { access: 'public', handleUploadUrl: `/api/public/portal/${token}/upload` })
        await call(`/api/public/portal/${token}`, { action: 'file', name, title: file.name, url: blob.url, size: file.size, contentType: file.type })
      } catch (e: any) {
        setError(`${file.name}: ${e.message}`)
      }
    }
    setUploading('')
    if (fileRef.current) fileRef.current.value = ''
    setMsg('Thanks — your files reached the team.')
    load()
  }

  if (!data) return <Shell>{error ? <Notice tone="bad">{error}</Notice> : <p className="text-sm text-slate-500">Loading your project…</p>}</Shell>
  const { project } = data
  const stageIdx = STAGES.findIndex(([id]) => id === project.stage)
  const waiting = data.milestones.filter((m) => m.status === 'ready_for_uat').length + data.changes.filter((c) => c.status === 'estimated').length
  const unpaid = data.invoices.filter((i) => i.status === 'sent')

  return (
    <Shell subtitle={`Project portal · ${project.client}`}>
      {msg && <Notice tone="good">{msg}</Notice>}
      {error && <Notice tone="bad">{error}</Notice>}
      {waiting > 0 && <Notice>{waiting} item{waiting > 1 ? 's need' : ' needs'} your decision below.</Notice>}

      <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {project.startDate ? `Started ${dt(project.startDate)}` : ''}
        {project.dueDate ? ` · target ${dt(project.dueDate)}` : ''}
      </p>

      <Card>
        <div className="flex gap-1">
          {STAGES.map(([id, label], i) => (
            <div key={id} className="flex-1 text-center">
              <div className={`h-2 rounded-full ${i < stageIdx ? 'bg-indigo-400' : i === stageIdx ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              <div className={`mt-1.5 text-[11px] ${i === stageIdx ? 'font-semibold text-indigo-700' : 'text-slate-400'}`}>{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <span>Current stage: <b>{project.stageLabel}</b></span>
          {project.tasksTotal > 0 && <span className="text-slate-500">{project.progress}% of tasks complete ({project.tasksDone}/{project.tasksTotal})</span>}
        </div>
        {project.stagingUrl && (
          <a href={project.stagingUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline">
            <ExternalLink className="h-4 w-4" /> Open the preview / test site
          </a>
        )}
        {project.warrantyEndsAt && (project.stage === 'support' || project.stage === 'closed') && <p className="mt-3 text-sm text-emerald-700">Delivered {dt(project.deliveredAt)}. Free support until {dt(project.warrantyEndsAt)}.</p>}
        <label className="mt-4 block text-xs text-slate-500">
          Your name (recorded with any approval you give)
          <input className={`${input} mt-1 max-w-xs`} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </Card>

      {project.stage === 'onboarding' && project.onboarding.length > 0 && (
        <Card title="Getting started">
          <ul className="space-y-1.5 text-sm">
            {project.onboarding.map((o, i) => (
              <li key={i} className="flex items-center gap-2">
                {o.done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Circle className="h-4 w-4 text-slate-300" />}
                <span className={o.done ? 'text-slate-500' : ''}>{o.label}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {data.milestones.length > 0 && (
        <Card title="Milestones">
          <div className="space-y-3">
            {data.milestones.map((m) => {
              const [label, cls] = M_LABEL[m.status] ?? [m.status, 'bg-slate-100']
              return (
                <div key={m.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-900">{m.title}</div>
                      <div className="text-xs text-slate-500">{m.dueDate ? `Due ${dt(m.dueDate)}` : ''}{m.tasks ? ` · ${m.tasksDone}/${m.tasks} tasks done` : ''}</div>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>
                  </div>
                  {m.description && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{m.description}</p>}
                  {m.clientDecisionBy && <p className="mt-2 text-xs text-slate-500">{m.status === 'approved' ? 'Approved' : 'Changes requested'} by {m.clientDecisionBy.replace(/ \(client.*$/, '')} on {dt(m.clientDecisionAt)}{m.clientNote ? ` — “${m.clientNote}”` : ''}</p>}
                  {m.status === 'ready_for_uat' && (
                    <div className="mt-3 space-y-2">
                      <textarea className={`${input} min-h-[70px]`} placeholder="Comments or what needs fixing (optional when approving)" value={notes[m.id] ?? ''} onChange={(e) => setNotes({ ...notes, [m.id]: e.target.value })} />
                      <div className="flex flex-wrap gap-2">
                        <button className={`${btn} bg-emerald-600 text-white hover:bg-emerald-500`} disabled={busy} onClick={() => act({ action: 'milestone', id: m.id, decision: 'approve', note: notes[m.id] ?? '' }, `Thank you — “${m.title}” is approved.`)}>Approve</button>
                        <button className={`${btn} border border-slate-300 text-slate-700 hover:bg-slate-100`} disabled={busy || !(notes[m.id] ?? '').trim()} onClick={() => act({ action: 'milestone', id: m.id, decision: 'changes', note: notes[m.id] ?? '' }, 'Thanks — the team will work on your comments.')}>Request changes</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {project.stage === 'delivery' && (
            <div className="mt-4 rounded-xl bg-indigo-50 p-4">
              <div className="font-semibold text-indigo-900">Final delivery sign-off</div>
              <p className="mt-1 text-sm text-indigo-800">Confirm that the project is delivered as agreed. Your free support period starts today.</p>
              <button className={`${btn} mt-3 bg-indigo-600 text-white hover:bg-indigo-500`} disabled={busy} onClick={() => window.confirm('Sign off the delivery?') && act({ action: 'delivery_signoff' }, 'Delivery signed off. Thank you for working with us!')}>Sign off delivery</button>
            </div>
          )}
        </Card>
      )}

      <Card title="Change requests">
        {data.changes.length > 0 && (
          <div className="mb-4 space-y-2">
            {data.changes.map((c) => {
              const [label, cls] = C_LABEL[c.status] ?? [c.status, 'bg-slate-100']
              return (
                <div key={c.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-900">{c.title}</span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${cls}`}>{label}</span>
                  </div>
                  {c.description && <p className="mt-1 text-slate-600">{c.description}</p>}
                  {(c.status === 'estimated' || c.cost > 0) && <p className="mt-1 text-slate-700">Estimate: <b>{inr(c.cost)}</b> + GST · adds {c.daysAdded} day{c.daysAdded === 1 ? '' : 's'}</p>}
                  {c.status === 'estimated' && (
                    <div className="mt-2 flex gap-2">
                      <button className={`${btn} bg-emerald-600 py-1.5 text-white hover:bg-emerald-500`} disabled={busy} onClick={() => act({ action: 'change_decision', id: c.id, decision: 'approve' }, 'Change approved. It is now on our task list.')}>Approve cost & time</button>
                      <button className={`${btn} border border-slate-300 py-1.5 text-slate-700 hover:bg-slate-100`} disabled={busy} onClick={() => act({ action: 'change_decision', id: c.id, decision: 'reject' }, 'Change declined.')}>Decline</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
        <div className="space-y-2">
          <input className={input} placeholder="Something new you need? Short title" value={cr.title} onChange={(e) => setCr({ ...cr, title: e.target.value })} />
          <textarea className={`${input} min-h-[70px]`} placeholder="Describe it — we'll reply with cost and time before any work starts." value={cr.description} onChange={(e) => setCr({ ...cr, description: e.target.value })} />
          <button className={`${btn} bg-indigo-600 text-white hover:bg-indigo-500`} disabled={busy || cr.title.trim().length < 3} onClick={() => act({ action: 'change_request', ...cr }, 'Request sent. We will estimate it and let you know.').then(() => setCr({ title: '', description: '' }))}>Send change request</button>
        </div>
      </Card>

      {data.invoices.length > 0 && (
        <Card title="Invoices" right={unpaid.length ? <span className="text-sm font-semibold text-amber-700">Due: {inr(unpaid.reduce((s, i) => s + i.total, 0))}</span> : null}>
          <ul className="divide-y divide-slate-100 text-sm">
            {data.invoices.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-3 py-2.5">
                <span className="flex-1">
                  <b>{i.number}</b> <span className="text-slate-500">· {i.items[0]?.description}</span>
                  <span className="block text-xs text-slate-500">{i.status === 'paid' ? `Paid ${dt(i.paidAt)}` : i.dueDate ? `Due ${dt(i.dueDate)}` : ''}</span>
                </span>
                <span className="font-semibold">{inr(i.total)}</span>
                {i.status === 'sent' && i.paymentLink ? (
                  <a className={`${btn} bg-indigo-600 py-1.5 text-white hover:bg-indigo-500`} href={i.paymentLink} target="_blank" rel="noreferrer">Pay now</a>
                ) : (
                  <span className={`rounded-full px-2 py-0.5 text-xs ${i.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{i.status === 'paid' ? 'Paid' : 'Unpaid'}</span>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card
        title="Files"
        right={
          data.uploadsEnabled ? (
            <>
              <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
              <button className={`${btn} border border-slate-300 py-1.5 text-slate-700 hover:bg-slate-100`} disabled={!!uploading} onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4" /> {uploading ? `Uploading…` : 'Upload files'}
              </button>
            </>
          ) : null
        }
      >
        {!data.files.length ? (
          <p className="text-sm text-slate-500">Logos, content, documents and builds we share will appear here. You can upload brand assets too.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {data.files.map((f) => (
              <li key={f.id} className="flex items-center gap-3 py-2">
                <Download className="h-4 w-4 text-slate-400" />
                <a href={f.url} target="_blank" rel="noreferrer" className="flex-1 truncate text-indigo-700 hover:underline">{f.title}</a>
                <span className="text-xs text-slate-400">{f.fromClient ? 'from you' : f.kind} · {dt(f.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Shell>
  )
}
