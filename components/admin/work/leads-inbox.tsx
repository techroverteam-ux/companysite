'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Download, Mail, Phone } from 'lucide-react'
import { useWorkspace } from './context'
import { api, downloadCsv, fmtDate } from './lib'
import { Empty, inputCls, filterCls, Loading, Pill } from './ui'

type Lead = {
  id: string
  type: 'contact' | 'meeting' | 'hire_team' | 'collaboration'
  name: string
  email: string
  phone: string
  company: string
  message: string
  details: Record<string, any>
  meetingDate: string | null
  meetingTime: string | null
  status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost' | 'spam'
  owner: string | null
  notes: string
  createdAt: string
}

const TYPE_LABEL: Record<Lead['type'], string> = { contact: 'Contact form', meeting: 'Meeting request', hire_team: 'Hire a team', collaboration: 'Collaboration' }
const STATUS: Record<Lead['status'], string> = {
  new: 'border-sky-800 bg-sky-950/50 text-sky-300',
  contacted: 'border-violet-800 bg-violet-950/50 text-violet-300',
  qualified: 'border-amber-800 bg-amber-950/50 text-amber-300',
  won: 'border-emerald-800 bg-emerald-950/50 text-emerald-300',
  lost: 'border-zinc-700 text-zinc-400',
  spam: 'border-zinc-800 text-zinc-600',
}

/** All public form submissions, stored in MongoDB. `meetingsOnly` powers the Meetings tab. */
export function LeadsInbox({ meetingsOnly = false }: { meetingsOnly?: boolean }) {
  const { users, notify } = useWorkspace()
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [type, setType] = useState<string>(meetingsOnly ? 'meeting' : '')
  const [status, setStatus] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => setType(meetingsOnly ? 'meeting' : ''), [meetingsOnly])

  const load = useCallback(async () => {
    const sp = new URLSearchParams()
    if (type) sp.set('type', type)
    if (status) sp.set('status', status)
    try {
      const res = await api<{ leads: Lead[] }>(`/api/admin/leads?${sp}`)
      setLeads(res.leads)
    } catch (e: any) {
      notify(e.message, 'error')
      setLeads([])
    }
  }, [type, status, notify])
  useEffect(() => {
    load()
  }, [load])

  const update = async (lead: Lead, patch: Partial<Pick<Lead, 'status' | 'owner' | 'notes'>>) => {
    setLeads((prev) => prev?.map((l) => (l.id === lead.id ? { ...l, ...patch } : l)) ?? null)
    try {
      await api(`/api/admin/leads/${lead.id}`, { method: 'PATCH', body: patch })
    } catch (e: any) {
      notify(e.message, 'error')
      load()
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const l of leads ?? []) c[l.status] = (c[l.status] ?? 0) + 1
    return c
  }, [leads])

  const exportCsv = () =>
    downloadCsv(`leads_${new Date().toISOString().slice(0, 10)}.csv`, [
      ['Received', 'Type', 'Name', 'Email', 'Phone', 'Company', 'Status', 'Meeting', 'Message'],
      ...(leads ?? []).map((l) => [l.createdAt.slice(0, 10), TYPE_LABEL[l.type], l.name, l.email, l.phone, l.company, l.status, l.meetingDate ? `${l.meetingDate} ${l.meetingTime}` : '', l.message]),
    ])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
        <div className="flex flex-wrap items-center gap-2">
          {!meetingsOnly && (
            <select className={filterCls} value={type} onChange={(e) => setType(e.target.value)} aria-label="Type">
              <option value="">All sources</option>
              {Object.entries(TYPE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          )}
          <select className={filterCls} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
            <option value="">Any status</option>
            {Object.keys(STATUS).map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <span className="text-xs text-zinc-500">
            {leads?.length ?? 0} total{counts.new ? <span className="text-sky-300"> · {counts.new} new</span> : null}
          </span>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      {leads === null ? (
        <Loading />
      ) : !leads.length ? (
        <Empty title={meetingsOnly ? 'No meeting requests yet.' : 'No inquiries yet.'}>New submissions from the website forms appear here instantly.</Empty>
      ) : (
        <div className="space-y-2">
          {leads.map((l) => (
            <div key={l.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60">
              <button onClick={() => setOpen(open === l.id ? null : l.id)} className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-zinc-100">
                    {l.name || l.email}
                    {l.company && <span className="text-zinc-500"> · {l.company}</span>}
                  </div>
                  <div className="truncate text-xs text-zinc-500">
                    {TYPE_LABEL[l.type]}
                    {l.meetingDate && ` · ${fmtDate(l.meetingDate, { weekday: 'short', day: 'numeric', month: 'short' })} at ${l.meetingTime}`}
                    {l.details?.meetingType && ` (${l.details.meetingType})`}
                    {l.details?.projectTitle && ` · ${l.details.projectTitle}`}
                    {' · received '}
                    {fmtDate(l.createdAt)}
                  </div>
                </div>
                <Pill className={STATUS[l.status]}>{l.status}</Pill>
              </button>
              {open === l.id && (
                <div className="grid gap-4 border-t border-zinc-800 px-4 py-4 md:grid-cols-[1fr_260px]">
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-wrap gap-4 text-zinc-300">
                      {l.email && (
                        <a href={`mailto:${l.email}`} className="flex items-center gap-1.5 text-indigo-300 hover:underline">
                          <Mail className="h-3.5 w-3.5" /> {l.email}
                        </a>
                      )}
                      {l.phone && (
                        <a href={`tel:${l.phone}`} className="flex items-center gap-1.5 text-indigo-300 hover:underline">
                          <Phone className="h-3.5 w-3.5" /> {l.phone}
                        </a>
                      )}
                    </div>
                    {l.message && <p className="whitespace-pre-wrap rounded-lg bg-zinc-950/70 p-3 text-zinc-300">{l.message}</p>}
                    {Object.entries(l.details ?? {}).filter(([, v]) => v && (!Array.isArray(v) || v.length)).length > 0 && (
                      <dl className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-1 text-xs">
                        {Object.entries(l.details)
                          .filter(([, v]) => v && (!Array.isArray(v) || v.length))
                          .map(([k, v]) => (
                            <div key={k} className="contents">
                              <dt className="text-zinc-500">{k.replace(/([A-Z])/g, ' $1').toLowerCase()}</dt>
                              <dd className="text-zinc-300">{Array.isArray(v) ? v.join(', ') : String(v)}</dd>
                            </div>
                          ))}
                      </dl>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs text-zinc-400">
                      Status
                      <select className={`${inputCls} mt-1`} value={l.status} onChange={(e) => update(l, { status: e.target.value as Lead['status'] })}>
                        {Object.keys(STATUS).map((s) => (
                          <option key={s} value={s}>
                            {s[0].toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs text-zinc-400">
                      Owner
                      <select className={`${inputCls} mt-1`} value={l.owner ?? ''} onChange={(e) => update(l, { owner: e.target.value || null })}>
                        <option value="">Nobody yet</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs text-zinc-400">
                      Internal notes
                      <textarea
                        className={`${inputCls} mt-1 min-h-[70px]`}
                        defaultValue={l.notes}
                        onBlur={(e) => e.target.value !== l.notes && update(l, { notes: e.target.value })}
                        placeholder="Call summary, next step…"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
