'use client'

import { useCallback, useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { useWorkspace } from './context'
import { api, downloadCsv, fmtDate, inr, INVOICE_STATUS, type Invoice } from './lib'
import { InvoiceActions } from './project-detail'
import { Empty, filterCls, Loading, Pill, Stat } from './ui'

/** Every invoice across projects, with what is outstanding and overdue. */
export function InvoicesView({ onOpenProject }: { onOpenProject: (id: string) => void }) {
  const { notify, version } = useWorkspace()
  const [list, setList] = useState<Invoice[] | null>(null)
  const [status, setStatus] = useState('')

  const load = useCallback(async () => {
    try {
      const r = await api<{ invoices: Invoice[] }>(`/api/admin/invoices${status ? `?status=${status}` : ''}`)
      setList(r.invoices)
    } catch (e: any) {
      notify(e.message, 'error')
      setList([])
    }
  }, [status, notify])
  useEffect(() => {
    load()
  }, [load, version])

  if (!list) return <Loading />
  const live = list.filter((i) => i.status !== 'cancelled')
  const outstanding = live.filter((i) => i.status === 'sent').reduce((s, i) => s + i.total, 0)
  const overdue = live.filter((i) => i.overdue).reduce((s, i) => s + i.total, 0)
  const month = new Date().toISOString().slice(0, 7)
  const received = live.filter((i) => i.status === 'paid' && (i.paidAt ?? '').startsWith(month)).reduce((s, i) => s + i.total, 0)
  const drafts = live.filter((i) => i.status === 'draft').length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Outstanding" value={inr(outstanding)} tone={outstanding ? 'warn' : 'default'} />
        <Stat label="Overdue" value={inr(overdue)} tone={overdue ? 'warn' : 'default'} />
        <Stat label="Received this month" value={inr(received)} tone="good" />
        <Stat label="Drafts to send" value={drafts} />
      </div>
      <div className="flex items-center justify-between">
        <select className={filterCls} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="">All invoices</option>
          {Object.entries(INVOICE_STATUS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
          onClick={() => downloadCsv(`invoices_${new Date().toISOString().slice(0, 10)}.csv`, [['Number', 'Client', 'Project', 'Subtotal', 'GST', 'Total', 'Status', 'Issued', 'Due', 'Paid', 'Reference'], ...list.map((i) => [i.number, i.clientName ?? '', i.projectName ?? '', i.subtotal, i.gstAmount, i.total, i.status, (i.issueDate ?? '').slice(0, 10), (i.dueDate ?? '').slice(0, 10), (i.paidAt ?? '').slice(0, 10), i.paymentRef])])}
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>
      {!list.length ? (
        <Empty title="No invoices yet.">Accepted proposals create the advance invoice automatically; more come from milestones.</Empty>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Client / project</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70 text-zinc-200">
                {list.map((i) => (
                  <tr key={i.id}>
                    <td className="px-4 py-3">
                      <span className="block font-medium">{i.number}</span>
                      <span className="block max-w-[260px] truncate text-[11px] text-zinc-500">{i.items[0]?.description}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block text-zinc-300">{i.clientName || '—'}</span>
                      <button className="text-[11px] text-indigo-300 hover:underline" onClick={() => onOpenProject(i.project)}>{i.projectName}</button>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{inr(i.total)}</td>
                    <td className="px-4 py-3">
                      <Pill className={INVOICE_STATUS[i.status].cls}>{INVOICE_STATUS[i.status].label}</Pill>
                      <span className={`block text-[10px] ${i.overdue ? 'font-semibold text-rose-400' : 'text-zinc-500'}`}>
                        {i.status === 'paid' ? `paid ${fmtDate(i.paidAt)}` : i.dueDate ? `${i.overdue ? 'overdue since' : 'due'} ${fmtDate(i.dueDate)}` : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3"><InvoiceActions inv={i} reload={load} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
