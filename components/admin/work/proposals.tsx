'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Copy, ExternalLink, MessageCircle, Plus, Send, Trash2 } from 'lucide-react'
import { useWorkspace } from './context'
import { api, copyText, dayOnly, fmtDate, inr, lineTotals, whatsappLink, type ClientLite, type LineItem } from './lib'
import { Btn, Empty, Field, filterCls, inputCls, Loading, Modal, Pill } from './ui'

type Proposal = {
  id: string
  number: string
  client: string
  clientName: string
  lead: string | null
  title: string
  summary: string
  items: LineItem[]
  discount: number
  gstPercent: number
  timelineWeeks: number
  milestones: { title: string; percent: number; weeksFromStart: number }[]
  terms: string
  validUntil: string | null
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  version: number
  sentAt: string | null
  decidedAt: string | null
  decidedByName: string
  decisionNote: string
  project: string | null
  subtotal: number
  gstAmount: number
  total: number
}

const STATUS: Record<Proposal['status'], string> = {
  draft: 'border-zinc-700 text-zinc-400',
  sent: 'border-sky-800 bg-sky-950/50 text-sky-300',
  accepted: 'border-emerald-800 bg-emerald-950/50 text-emerald-300',
  rejected: 'border-rose-800 bg-rose-950/50 text-rose-300',
  expired: 'border-amber-800 bg-amber-950/50 text-amber-300',
}

const DEFAULT_TERMS = `• 50% advance before work starts, balance on milestones as listed.
• Prices exclude GST unless stated.
• Changes outside this scope are quoted separately as change requests.
• 90 days free support for bugs after delivery.`

type Form = Omit<Proposal, 'id' | 'number' | 'clientName' | 'status' | 'version' | 'sentAt' | 'decidedAt' | 'decidedByName' | 'decisionNote' | 'project' | 'subtotal' | 'gstAmount' | 'total'> & { id?: string }

const blank = (client = '', lead: string | null = null, title = ''): Form => ({
  client,
  lead,
  title,
  summary: '',
  items: [{ description: '', quantity: 1, rate: 0 }],
  discount: 0,
  gstPercent: 18,
  timelineWeeks: 6,
  milestones: [
    { title: 'Advance & kickoff', percent: 50, weeksFromStart: 0 },
    { title: 'Delivery & sign-off', percent: 50, weeksFromStart: 6 },
  ],
  terms: DEFAULT_TERMS,
  validUntil: null,
})

export function ProposalsView({ preset, onPresetUsed, onOpenProject }: { preset?: { client: string; lead?: string; title?: string } | null; onPresetUsed?: () => void; onOpenProject: (id: string) => void }) {
  const { notify, bump, version, refreshProjects } = useWorkspace()
  const [list, setList] = useState<Proposal[] | null>(null)
  const [clients, setClients] = useState<ClientLite[]>([])
  const [status, setStatus] = useState('')
  const [form, setForm] = useState<Form | null>(null)
  const [busy, setBusy] = useState(false)
  const [shared, setShared] = useState<{ url: string; p: Proposal; emailed: boolean } | null>(null)

  const load = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([api<{ proposals: Proposal[] }>('/api/admin/proposals'), api<{ clients: ClientLite[] }>('/api/admin/clients')])
      setList(p.proposals)
      setClients(c.clients)
    } catch (e: any) {
      notify(e.message, 'error')
      setList([])
    }
  }, [notify])
  useEffect(() => {
    load()
  }, [load, version])

  useEffect(() => {
    if (preset?.client) {
      setForm(blank(preset.client, preset.lead ?? null, preset.title ?? ''))
      onPresetUsed?.()
    }
  }, [preset, onPresetUsed])

  const t = useMemo(() => (form ? lineTotals(form.items, form.gstPercent, form.discount) : null), [form])
  const msTotal = form ? form.milestones.reduce((s, m) => s + Number(m.percent || 0), 0) : 0

  const save = async (andSend = false) => {
    if (!form) return
    setBusy(true)
    const body = {
      ...form,
      items: form.items.filter((i) => i.description.trim()).map((i) => ({ ...i, quantity: Number(i.quantity), rate: Number(i.rate) })),
      milestones: form.milestones.filter((m) => m.title.trim()).map((m) => ({ ...m, percent: Number(m.percent), weeksFromStart: Number(m.weeksFromStart) })),
      validUntil: form.validUntil ? dayOnly(form.validUntil) : null,
    }
    try {
      const res = form.id
        ? await api<{ proposal: Proposal }>(`/api/admin/proposals/${form.id}`, { method: 'PATCH', body })
        : await api<{ proposal: Proposal }>('/api/admin/proposals', { method: 'POST', body })
      notify('Proposal saved.')
      setForm(null)
      if (andSend) await send(res.proposal)
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const send = async (p: Proposal, email = false) => {
    try {
      const r = await api<{ url: string; emailed: boolean }>(`/api/admin/proposals/${p.id}/send`, { method: 'POST', body: { email } })
      setShared({ url: r.url, p, emailed: r.emailed })
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  const markAccepted = async (p: Proposal) => {
    const name = window.prompt('Who accepted it on the client side? (name)', '')
    if (name === null) return
    try {
      const r = await api<{ project: string }>(`/api/admin/proposals/${p.id}`, { method: 'POST', body: { action: 'accept', name } })
      notify('Accepted. Project, milestones and advance invoice created.')
      await refreshProjects()
      bump()
      onOpenProject(r.project)
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  const remove = async (p: Proposal) => {
    if (!window.confirm(`Delete ${p.number}?`)) return
    try {
      await api(`/api/admin/proposals/${p.id}`, { method: 'DELETE' })
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  const setItem = (i: number, patch: Partial<LineItem>) => form && setForm({ ...form, items: form.items.map((x, j) => (j === i ? { ...x, ...patch } : x)) })
  const setMs = (i: number, patch: Partial<Form['milestones'][number]>) => form && setForm({ ...form, milestones: form.milestones.map((x, j) => (j === i ? { ...x, ...patch } : x)) })

  if (!list) return <Loading />
  const shown = list.filter((p) => !status || p.status === status)
  const pipeline = list.filter((p) => p.status === 'sent').reduce((s, p) => s + p.subtotal, 0)
  const won = list.filter((p) => p.status === 'accepted').reduce((s, p) => s + p.subtotal, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <select className={filterCls} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
            <option value="">All proposals</option>
            {Object.keys(STATUS).map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <span className="text-xs text-zinc-500">
            Waiting on clients: <b className="text-sky-300">{inr(pipeline)}</b> · Won: <b className="text-emerald-300">{inr(won)}</b> (before GST)
          </span>
        </div>
        <Btn variant="primary" size="sm" onClick={() => setForm(blank(clients[0]?.id ?? ''))} disabled={!clients.length} title={!clients.length ? 'Add a client first (or convert a lead)' : ''}>
          <Plus className="h-4 w-4" /> New proposal
        </Btn>
      </div>

      {!shown.length ? (
        <Empty title="No proposals yet.">Convert a lead into a client from Inquiries & Leads, then create a proposal for them.</Empty>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Proposal</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3 text-right">Value (excl. GST)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70 text-zinc-200">
                {shown.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <button className="text-left hover:underline" onClick={() => p.status !== 'accepted' && setForm({ ...p })}>
                        <span className="block font-medium">{p.title}</span>
                        <span className="block text-[11px] text-zinc-500">
                          {p.number} · v{p.version}
                          {p.validUntil ? ` · valid till ${fmtDate(p.validUntil)}` : ''}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{p.clientName}</td>
                    <td className="px-4 py-3 text-right font-medium">{inr(p.subtotal)}</td>
                    <td className="px-4 py-3">
                      <Pill className={STATUS[p.status]}>{p.status}</Pill>
                      {p.decidedByName && <span className="block text-[10px] text-zinc-500">by {p.decidedByName}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {p.status === 'accepted' && p.project ? (
                          <Btn size="sm" variant="outline" onClick={() => onOpenProject(p.project!)}>
                            Open project
                          </Btn>
                        ) : (
                          <>
                            <Btn size="sm" variant="outline" onClick={() => send(p)}>
                              <Send className="h-3.5 w-3.5" /> {p.status === 'sent' ? 'New link' : 'Send'}
                            </Btn>
                            {p.status === 'sent' && (
                              <Btn size="sm" variant="ghost" title="Client accepted offline" onClick={() => markAccepted(p)}>
                                <Check className="h-3.5 w-3.5" />
                              </Btn>
                            )}
                            <Btn size="sm" variant="ghost" onClick={() => remove(p)} aria-label="Delete">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Btn>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={!!form}
        onClose={() => setForm(null)}
        wide
        title={form?.id ? 'Edit proposal' : 'New proposal'}
        footer={
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-zinc-400">
              {t && (
                <>
                  Subtotal {inr(t.subtotal)} + GST {inr(t.gst)} = <b className="text-white">{inr(t.total)}</b>
                </>
              )}
            </span>
            <div className="flex gap-2">
              <Btn variant="ghost" onClick={() => setForm(null)}>
                Cancel
              </Btn>
              <Btn variant="outline" busy={busy} onClick={() => save(false)}>
                Save draft
              </Btn>
              <Btn variant="primary" busy={busy} onClick={() => save(true)}>
                <Send className="h-3.5 w-3.5" /> Save & get link
              </Btn>
            </div>
          </div>
        }
      >
        {form && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Client">
                <select className={inputCls} value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })}>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Proposal title">
                <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. ERP for Radhika Machine Tools" />
              </Field>
            </div>
            <Field label="Scope & deliverables" hint="The client sees this exactly as written.">
              <textarea className={`${inputCls} min-h-[110px]`} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </Field>

            <div>
              <div className="mb-1.5 text-xs font-medium text-zinc-400">Line items (₹, before GST)</div>
              <div className="space-y-2">
                {form.items.map((it, i) => (
                  <div key={i} className="grid grid-cols-[1fr_70px_120px_110px_28px] items-center gap-2">
                    <input className={inputCls} placeholder="Description" value={it.description} onChange={(e) => setItem(i, { description: e.target.value })} />
                    <input type="number" min={0} className={inputCls} value={it.quantity} onChange={(e) => setItem(i, { quantity: Number(e.target.value) })} aria-label="Quantity" />
                    <input type="number" min={0} className={inputCls} value={it.rate} onChange={(e) => setItem(i, { rate: Number(e.target.value) })} aria-label="Rate" />
                    <span className="text-right text-sm text-zinc-300">{inr((Number(it.quantity) || 0) * (Number(it.rate) || 0))}</span>
                    <button className="text-zinc-500 hover:text-rose-400" onClick={() => setForm({ ...form, items: form.items.filter((_, j) => j !== i) })} aria-label="Remove line">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <Btn size="sm" variant="ghost" className="mt-2" onClick={() => setForm({ ...form, items: [...form.items, { description: '', quantity: 1, rate: 0 }] })}>
                <Plus className="h-3.5 w-3.5" /> Add line
              </Btn>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="Discount (₹)">
                <input type="number" min={0} className={inputCls} value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} />
              </Field>
              <Field label="GST %">
                <select className={inputCls} value={form.gstPercent} onChange={(e) => setForm({ ...form, gstPercent: Number(e.target.value) })}>
                  {[0, 5, 12, 18, 28].map((g) => (
                    <option key={g} value={g}>
                      {g}%
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Timeline (weeks)">
                <input type="number" min={0} className={inputCls} value={form.timelineWeeks} onChange={(e) => setForm({ ...form, timelineWeeks: Number(e.target.value) })} />
              </Field>
              <Field label="Valid until">
                <input type="date" className={inputCls} value={dayOnly(form.validUntil)} onChange={(e) => setForm({ ...form, validUntil: e.target.value || null })} />
              </Field>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-zinc-400">
                <span>Payment milestones</span>
                <span className={Math.round(msTotal) === 100 ? 'text-emerald-400' : 'text-amber-300'}>{msTotal}% of 100%</span>
              </div>
              <div className="space-y-2">
                {form.milestones.map((m, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px_110px_28px] items-center gap-2">
                    <input className={inputCls} placeholder="Milestone" value={m.title} onChange={(e) => setMs(i, { title: e.target.value })} />
                    <input type="number" min={0} max={100} className={inputCls} value={m.percent} onChange={(e) => setMs(i, { percent: Number(e.target.value) })} aria-label="Percent" />
                    <input type="number" min={0} className={inputCls} value={m.weeksFromStart} onChange={(e) => setMs(i, { weeksFromStart: Number(e.target.value) })} aria-label="Due in weeks" title="Due (weeks from start)" />
                    <button className="text-zinc-500 hover:text-rose-400" onClick={() => setForm({ ...form, milestones: form.milestones.filter((_, j) => j !== i) })} aria-label="Remove milestone">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">Columns: name · % of value billed · due (weeks after start). On acceptance these become project milestones and the first one gets a draft invoice.</p>
              <Btn size="sm" variant="ghost" className="mt-1" onClick={() => setForm({ ...form, milestones: [...form.milestones, { title: '', percent: 0, weeksFromStart: form.timelineWeeks }] })}>
                <Plus className="h-3.5 w-3.5" /> Add milestone
              </Btn>
            </div>

            <Field label="Terms">
              <textarea className={`${inputCls} min-h-[90px]`} value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} />
            </Field>
          </div>
        )}
      </Modal>

      <Modal open={!!shared} onClose={() => setShared(null)} title="Proposal link ready" footer={<Btn variant="primary" onClick={() => setShared(null)}>Done</Btn>}>
        {shared && (
          <div className="space-y-3 text-sm text-zinc-300">
            <p>
              Send this private link to {shared.p.clientName}. They can read the proposal and accept it online.
              {shared.emailed && ' It was also emailed to them.'} Older links for this proposal no longer work.
            </p>
            <div className="flex gap-2">
              <input readOnly className={`${inputCls} font-mono text-xs`} value={shared.url} onFocus={(e) => e.target.select()} />
              <Btn variant="outline" onClick={() => notify(copyText(shared.url) ? 'Link copied.' : 'Copy the link manually.')}>
                <Copy className="h-3.5 w-3.5" />
              </Btn>
            </div>
            <div className="flex flex-wrap gap-2">
              <a className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500" target="_blank" rel="noreferrer" href={whatsappLink(`Hi, here is our proposal "${shared.p.title}" (${shared.p.number}). You can review and accept it here: ${shared.url}`)}>
                <MessageCircle className="h-3.5 w-3.5" /> Share on WhatsApp
              </a>
              <Btn size="sm" variant="outline" onClick={() => send(shared.p, true)}>
                Email it to the client
              </Btn>
              <a className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:underline" href={shared.url} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3 w-3" /> Preview
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
