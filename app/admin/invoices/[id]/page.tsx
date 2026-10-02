'use client'

import { use, useEffect, useState } from 'react'

type Data = {
  invoice: { number: string; items: { description: string; quantity: number; rate: number }[]; gstPercent: number; subtotal: number; gstAmount: number; total: number; status: string; issueDate: string | null; dueDate: string | null; paidAt: string | null; paymentRef: string; paymentLink: string; notes: string; createdAt: string }
  project: { name: string }
  client: { name: string; contactPerson: string; email: string; phone: string; billingAddress: string; gstin: string } | null
  company: { name: string; address: string; gstin: string; email: string; bank: string }
}

const inr = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const d = (v: string | null) => (v ? new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')

/** Printable tax invoice (use the browser's Print → Save as PDF). */
export default function InvoicePrint({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    fetch(`/api/admin/invoices/${id}`)
      .then(async (r) => (r.ok ? setData(await r.json()) : setError((await r.json()).error || 'Not found')))
      .catch(() => setError('Could not load the invoice.'))
  }, [id])

  if (error) return <p className="p-10 text-center text-sm text-red-600">{error}</p>
  if (!data) return <p className="p-10 text-center text-sm text-gray-500">Loading…</p>
  const { invoice: inv, client, company } = data
  const half = inv.gstAmount / 2

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-3xl justify-end gap-2 print:hidden">
        <button onClick={() => window.print()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Print / Save PDF</button>
      </div>
      <div className="mx-auto max-w-3xl bg-white p-10 text-sm text-gray-800 shadow print:shadow-none">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            {company.address && <p className="mt-1 whitespace-pre-line text-gray-600">{company.address}</p>}
            {company.gstin && <p className="text-gray-600">GSTIN: {company.gstin}</p>}
            {company.email && <p className="text-gray-600">{company.email}</p>}
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold uppercase tracking-wide text-gray-900">Tax invoice</p>
            <p className="font-mono">{inv.number}</p>
            <p className="mt-2 text-gray-600">Date: {d(inv.issueDate ?? inv.createdAt)}</p>
            <p className="text-gray-600">Due: {d(inv.dueDate)}</p>
            {inv.status === 'paid' && <p className="mt-2 inline-block rounded bg-green-100 px-2 py-0.5 font-semibold text-green-700">PAID {d(inv.paidAt)}</p>}
            {inv.status === 'cancelled' && <p className="mt-2 inline-block rounded bg-gray-200 px-2 py-0.5 font-semibold text-gray-600">CANCELLED</p>}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Bill to</p>
            <p className="mt-1 font-semibold text-gray-900">{client?.name ?? '—'}</p>
            {client?.contactPerson && <p>{client.contactPerson}</p>}
            {client?.billingAddress && <p className="whitespace-pre-line text-gray-600">{client.billingAddress}</p>}
            {client?.gstin && <p className="text-gray-600">GSTIN: {client.gstin}</p>}
            {client?.email && <p className="text-gray-600">{client.email}</p>}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Project</p>
            <p className="mt-1">{data.project.name}</p>
          </div>
        </div>

        <table className="mt-8 w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-800 text-left text-xs uppercase text-gray-500">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.items.map((it, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="py-2">{it.description}</td>
                <td className="py-2 text-right">{it.quantity}</td>
                <td className="py-2 text-right">{inr(it.rate)}</td>
                <td className="py-2 text-right">{inr(it.quantity * it.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto mt-4 w-64 space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span>{inr(inv.subtotal)}</span></div>
          {inv.gstPercent > 0 && (
            <>
              <div className="flex justify-between text-gray-600"><span>CGST {inv.gstPercent / 2}%</span><span>{inr(half)}</span></div>
              <div className="flex justify-between text-gray-600"><span>SGST {inv.gstPercent / 2}%</span><span>{inr(half)}</span></div>
            </>
          )}
          <div className="flex justify-between border-t-2 border-gray-800 pt-1 text-base font-bold"><span>Total</span><span>{inr(inv.total)}</span></div>
        </div>
        <p className="mt-2 text-right text-[11px] text-gray-500">For inter-state supply, charge IGST {inv.gstPercent}% instead of CGST + SGST.</p>

        {(company.bank || inv.paymentLink) && (
          <div className="mt-8 rounded border border-gray-200 p-4">
            <p className="text-xs font-semibold uppercase text-gray-500">How to pay</p>
            {inv.paymentLink && <p className="mt-1">Pay online: <a className="text-indigo-600 underline" href={inv.paymentLink}>{inv.paymentLink}</a></p>}
            {company.bank && <p className="mt-1 whitespace-pre-line">{company.bank}</p>}
          </div>
        )}
        {inv.notes && <p className="mt-6 whitespace-pre-line text-gray-600">{inv.notes}</p>}
        <p className="mt-10 text-center text-[11px] text-gray-400">This is a computer-generated invoice.</p>
      </div>
    </div>
  )
}
