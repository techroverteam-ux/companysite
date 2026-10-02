'use client'

import { useCallback, useEffect, useState } from 'react'
import { BadgeCheck, Plus, Star } from 'lucide-react'
import { useWorkspace } from './context'
import { api, fmtDate } from './lib'
import { Btn, Empty, Field, filterCls, inputCls, Loading, Modal, Pill } from './ui'

type Review = { id: string; projectName: string; name: string; role: string; company: string; rating: number; whatWeBuilt: string; text: string; improve: string; consent: boolean; status: 'pending' | 'published' | 'private' | 'rejected'; verified: boolean; publishedAt: string | null; createdAt: string }

const STATUS: Record<Review['status'], { label: string; cls: string }> = {
  pending: { label: 'Waiting for approval', cls: 'border-amber-800 bg-amber-950/50 text-amber-300' },
  published: { label: 'On the website', cls: 'border-emerald-800 bg-emerald-950/50 text-emerald-300' },
  private: { label: 'Private feedback', cls: 'border-violet-800 bg-violet-950/50 text-violet-300' },
  rejected: { label: 'Hidden', cls: 'border-zinc-700 text-zinc-500' },
}

const Stars = ({ n }: { n: number }) => (
  <span className="flex">
    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`h-3.5 w-3.5 ${i <= n ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`} />)}
  </span>
)

/** Reviews from client links (verified) and ones you add; approve to publish on the website. */
export function ReviewsView() {
  const { notify, version, bump } = useWorkspace()
  const [list, setList] = useState<Review[] | null>(null)
  const [status, setStatus] = useState('')
  const [form, setForm] = useState<null | { name: string; role: string; company: string; rating: number; text: string; whatWeBuilt: string }>(null)

  const load = useCallback(async () => {
    try {
      const r = await api<{ reviews: Review[] }>(`/api/admin/reviews${status ? `?status=${status}` : ''}`)
      setList(r.reviews)
    } catch (e: any) {
      notify(e.message, 'error')
      setList([])
    }
  }, [status, notify])
  useEffect(() => {
    load()
  }, [load, version])

  const set = async (r: Review, s: Review['status']) => {
    try {
      await api(`/api/admin/reviews/${r.id}`, { method: 'PATCH', body: { status: s } })
      notify(s === 'published' ? 'Published on the website.' : 'Updated.')
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }
  const add = async () => {
    if (!form) return
    try {
      await api('/api/admin/reviews', { method: 'POST', body: form })
      setForm(null)
      bump()
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  if (!list) return <Loading />
  const avg = list.filter((r) => r.status === 'published').reduce((s, r, _, a) => s + r.rating / a.length, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <select className={filterCls} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
            <option value="">All reviews</option>
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          {avg > 0 && <span className="text-xs text-zinc-400">Published average <b className="text-amber-300">{avg.toFixed(1)}★</b></span>}
        </div>
        <Btn size="sm" variant="outline" onClick={() => setForm({ name: '', role: '', company: '', rating: 5, text: '', whatWeBuilt: '' })}>
          <Plus className="h-3.5 w-3.5" /> Add a review you received
        </Btn>
      </div>
      <p className="text-xs text-zinc-500">Send review links from a project's “Client access” tab. Reviews from those links are marked verified.</p>
      {!list.length ? (
        <Empty title="No reviews yet." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {list.map((r) => (
            <div key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 font-medium text-zinc-100">
                    {r.name} {r.verified && <BadgeCheck className="h-4 w-4 text-sky-400" aria-label="Verified client" />}
                  </div>
                  <div className="text-[11px] text-zinc-500">{[r.role, r.company].filter(Boolean).join(', ')}{r.projectName ? ` · ${r.projectName}` : ''} · {fmtDate(r.createdAt)}</div>
                </div>
                <Stars n={r.rating} />
              </div>
              {r.text && <p className="mt-3 text-sm text-zinc-300">“{r.text}”</p>}
              {r.improve && <p className="mt-2 rounded bg-zinc-950/70 p-2 text-xs text-zinc-400"><b>Could improve:</b> {r.improve}</p>}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <Pill className={STATUS[r.status].cls}>{STATUS[r.status].label}</Pill>
                <div className="flex gap-1">
                  {r.status !== 'published' && r.consent && r.status !== 'private' && <Btn size="sm" variant="primary" onClick={() => set(r, 'published')}>Publish</Btn>}
                  {r.status === 'published' && <Btn size="sm" variant="ghost" onClick={() => set(r, 'rejected')}>Unpublish</Btn>}
                  {r.status === 'pending' && <Btn size="sm" variant="ghost" onClick={() => set(r, 'rejected')}>Hide</Btn>}
                  {!r.consent && <span className="text-[11px] text-zinc-500">No consent to publish</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={!!form} onClose={() => setForm(null)} title="Add a review" footer={<><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn><Btn variant="primary" onClick={add}>Save</Btn></>}>
        {form && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Rating"><select className={inputCls} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}</select></Field>
            <Field label="Role"><input className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></Field>
            <Field label="Company"><input className={inputCls} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
            <Field label="What we built" className="sm:col-span-2"><input className={inputCls} value={form.whatWeBuilt} onChange={(e) => setForm({ ...form, whatWeBuilt: e.target.value })} /></Field>
            <Field label="Review text (as the client wrote it)" className="sm:col-span-2"><textarea className={`${inputCls} min-h-[90px]`} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} /></Field>
          </div>
        )}
      </Modal>
    </div>
  )
}
