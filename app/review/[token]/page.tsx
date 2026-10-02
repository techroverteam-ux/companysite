'use client'

import { use, useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { btn, call, Card, input, Notice, Shell } from '@/components/client/shell'

export default function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [info, setInfo] = useState<{ name: string; project: string; company: string } | null>(null)
  const [error, setError] = useState('')
  const [f, setF] = useState({ rating: 0, name: '', role: '', company: '', whatWeBuilt: '', text: '', improve: '', consent: true })
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<null | { google: string }>(null)

  useEffect(() => {
    call<{ name: string; project: string; company: string }>(`/api/public/review/${token}`)
      .then((r) => { setInfo(r); setF((x) => ({ ...x, name: r.name || '', company: r.company || '', whatWeBuilt: r.project || '' })) })
      .catch((e) => setError(e.message))
  }, [token])

  const submit = async () => {
    setBusy(true)
    setError('')
    try {
      const r = await call<{ askGoogle: boolean; googleReviewUrl: string }>(`/api/public/review/${token}`, f)
      setDone({ google: r.askGoogle ? r.googleReviewUrl : '' })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <Shell>
        <Notice tone="good">Thank you{f.name ? `, ${f.name.split(' ')[0]}` : ''}! Your feedback reached our team.</Notice>
        {done.google && (
          <Card title="One more favour?">
            <p className="text-sm text-slate-600">If you have a minute, posting the same review on Google helps other businesses find us.</p>
            <a className={`${btn} mt-3 bg-indigo-600 text-white hover:bg-indigo-500`} href={done.google} target="_blank" rel="noreferrer">Review us on Google</a>
          </Card>
        )}
      </Shell>
    )
  }
  if (!info) return <Shell>{error ? <Notice tone="bad">{error}</Notice> : <p className="text-sm text-slate-500">Loading…</p>}</Shell>
  const low = f.rating > 0 && f.rating <= 3

  return (
    <Shell subtitle="Your feedback">
      <h1 className="text-2xl font-bold text-slate-900">How did we do{info.project ? ` on ${info.project}` : ''}?</h1>
      <p className="mt-1 text-sm text-slate-500">Takes about 2 minutes. This link works once.</p>
      <Card>
        {error && <Notice tone="bad">{error}</Notice>}
        <div className="mb-4">
          <div className="mb-1 text-sm font-medium">Overall rating</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setF({ ...f, rating: n })} aria-label={`${n} star${n > 1 ? 's' : ''}`}>
                <Star className={`h-8 w-8 ${n <= f.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm">Your name<input className={`${input} mt-1`} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
          <label className="text-sm">Role<input className={`${input} mt-1`} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} placeholder="e.g. Director" /></label>
          <label className="text-sm">Company<input className={`${input} mt-1`} value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} /></label>
        </div>
        <label className="mt-3 block text-sm">What did we build for you?<input className={`${input} mt-1`} value={f.whatWeBuilt} onChange={(e) => setF({ ...f, whatWeBuilt: e.target.value })} /></label>
        {!low && <label className="mt-3 block text-sm">What went well?<textarea className={`${input} mt-1 min-h-[100px]`} value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} /></label>}
        <label className="mt-3 block text-sm">{low ? 'What should we have done better? (goes privately to our founder)' : 'Anything we could improve? (private)'}<textarea className={`${input} mt-1 min-h-[80px]`} value={f.improve} onChange={(e) => setF({ ...f, improve: e.target.value })} /></label>
        {!low && (
          <label className="mt-3 flex items-start gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} className="mt-0.5" />
            TechRover may publish my rating, name, role, company and “what went well” on its website.
          </label>
        )}
        <button className={`${btn} mt-4 bg-indigo-600 text-white hover:bg-indigo-500`} disabled={busy || !f.rating || f.name.trim().length < 2} onClick={submit}>Send feedback</button>
      </Card>
    </Shell>
  )
}
