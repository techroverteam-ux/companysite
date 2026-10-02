'use client'

import { use, useEffect, useState } from 'react'
import { btn, call, Card, dt, inr, input, Notice, Shell } from '@/components/client/shell'

type P = {
  number: string; title: string; summary: string; items: { description: string; quantity: number; rate: number }[]; discount: number; gstPercent: number
  gross: number; subtotal: number; gstAmount: number; total: number; timelineWeeks: number; milestones: { title: string; percent: number; weeksFromStart: number }[]
  terms: string; validUntil: string | null; status: string; version: number; decidedAt: string | null; decidedByName: string; clientName: string; contactName: string
}

export default function ProposalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [p, setP] = useState<P | null>(null)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState('')

  const load = () => call<{ proposal: P }>(`/api/public/proposals/${token}`).then((r) => { setP(r.proposal); setName((n) => n || r.proposal.contactName) }).catch((e) => setError(e.message))
  useEffect(() => { load() }, [token])

  const decide = async (decision: 'accept' | 'reject') => {
    if (decision === 'reject' && !window.confirm('Decline this proposal?')) return
    setBusy(true)
    setError('')
    try {
      await call(`/api/public/proposals/${token}`, { decision, name, note, agree })
      setDone(decision === 'accept' ? 'Thank you! The proposal is accepted. We will reach out within one working day to kick off.' : 'Thanks for letting us know. We have notified the team.')
      load()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  if (!p) return <Shell>{error ? <Notice tone="bad">{error}</Notice> : <p className="text-sm text-slate-500">Loading…</p>}</Shell>
  const open = p.status === 'sent'

  return (
    <Shell subtitle={`Proposal ${p.number}${p.version > 1 ? ` · version ${p.version}` : ''}`}>
      {done && <Notice tone="good">{done}</Notice>}
      {p.status === 'accepted' && !done && <Notice tone="good">Accepted by {p.decidedByName} on {dt(p.decidedAt)}. Thank you!</Notice>}
      {p.status === 'rejected' && !done && <Notice>Declined on {dt(p.decidedAt)}.</Notice>}
      {p.status === 'expired' && <Notice tone="bad">This proposal expired on {dt(p.validUntil)}. Please ask us for an updated one.</Notice>}

      <h1 className="text-2xl font-bold text-slate-900">{p.title}</h1>
      <p className="mt-1 text-sm text-slate-500">Prepared for {p.clientName}{p.validUntil ? ` · valid until ${dt(p.validUntil)}` : ''}</p>

      {p.summary && (
        <Card title="Scope">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{p.summary}</p>
        </Card>
      )}

      <Card title="Price">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            {p.items.map((i, k) => (
              <tr key={k}>
                <td className="py-2 pr-2">{i.description}{i.quantity !== 1 && <span className="text-slate-400"> × {i.quantity}</span>}</td>
                <td className="py-2 text-right">{inr(i.quantity * i.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ml-auto mt-3 w-64 space-y-1 text-sm">
          {p.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount</span><span>−{inr(p.discount)}</span></div>}
          <div className="flex justify-between"><span>Subtotal</span><span>{inr(p.subtotal)}</span></div>
          <div className="flex justify-between text-slate-500"><span>GST {p.gstPercent}%</span><span>{inr(p.gstAmount)}</span></div>
          <div className="flex justify-between border-t border-slate-200 pt-1 text-base font-bold text-slate-900"><span>Total</span><span>{inr(p.total)}</span></div>
        </div>
      </Card>

      {p.milestones.length > 0 && (
        <Card title={`Timeline & payments${p.timelineWeeks ? ` · about ${p.timelineWeeks} weeks` : ''}`}>
          <ol className="space-y-2 text-sm">
            {p.milestones.map((m, k) => (
              <li key={k} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
                <span><b className="mr-2 text-slate-400">{k + 1}.</b>{m.title}<span className="text-slate-400"> · week {m.weeksFromStart}</span></span>
                <span className="font-medium">{m.percent}% · {inr((p.subtotal * m.percent) / 100)}</span>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {p.terms && (
        <Card title="Terms">
          <p className="whitespace-pre-wrap text-sm text-slate-600">{p.terms}</p>
        </Card>
      )}

      {open && (
        <Card title="Your decision">
          {error && <Notice tone="bad">{error}</Notice>}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">Your full name<input className={`${input} mt-1`} value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="text-sm">Note (optional)<input className={`${input} mt-1`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="PO number, start date…" /></label>
          </div>
          <label className="mt-3 flex items-start gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5" />
            I accept the scope, price and terms above on behalf of {p.clientName}.
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className={`${btn} bg-indigo-600 text-white hover:bg-indigo-500`} disabled={busy || !agree || name.trim().length < 2} onClick={() => decide('accept')}>Accept proposal</button>
            <button className={`${btn} border border-slate-300 text-slate-700 hover:bg-slate-100`} disabled={busy || name.trim().length < 2} onClick={() => decide('reject')}>Decline</button>
          </div>
          <p className="mt-3 text-xs text-slate-400">Your name, the time and your IP address are recorded as confirmation.</p>
        </Card>
      )}
    </Shell>
  )
}
