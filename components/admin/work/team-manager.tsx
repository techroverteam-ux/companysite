'use client'

import { useCallback, useEffect, useState } from 'react'
import { KeyRound, Pencil, Plus, UserCheck, UserX } from 'lucide-react'
import { useWorkspace } from './context'
import { api, inr, ROLE_LABEL, type Role, type StaffUser } from './lib'
import { Avatar, Btn, Field, inputCls, Loading, Modal, Pill } from './ui'

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#64748b']

type Form = { id?: string; name: string; email: string; role: Role; title: string; hourlyRate: string; weeklyCapacityHours: string; color: string; password: string }

function randomPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  const arr = new Uint32Array(14)
  crypto.getRandomValues(arr)
  return Array.from(arr, (n) => chars[n % chars.length]).join('')
}

export function TeamManager({ onViewTimesheet, onViewTasks }: { onViewTimesheet: (id: string) => void; onViewTasks: (id: string) => void }) {
  const { me, notify, refreshUsers } = useWorkspace()
  const [list, setList] = useState<StaffUser[] | null>(null)
  const [form, setForm] = useState<Form | null>(null)
  const [busy, setBusy] = useState(false)
  const [shownPassword, setShownPassword] = useState<{ name: string; email: string; password: string } | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await api<{ users: StaffUser[] }>('/api/admin/users?all=1')
      setList(res.users)
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }, [notify])
  useEffect(() => {
    load()
  }, [load])

  const save = async () => {
    if (!form) return
    setBusy(true)
    const body: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      role: form.role,
      title: form.title,
      hourlyRate: Number(form.hourlyRate || 0),
      weeklyCapacityHours: Number(form.weeklyCapacityHours || 40),
      color: form.color,
    }
    if (form.password) body.password = form.password
    try {
      if (form.id) await api(`/api/admin/users/${form.id}`, { method: 'PATCH', body })
      else await api('/api/admin/users', { method: 'POST', body })
      if (form.password) setShownPassword({ name: form.name, email: form.email, password: form.password })
      notify(form.id ? 'Team member saved.' : 'Team member added.')
      setForm(null)
      await Promise.all([load(), refreshUsers()])
    } catch (e: any) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const setActive = async (u: StaffUser, active: boolean) => {
    if (!active && !window.confirm(`Deactivate ${u.name}? They will not be able to log in. Their tasks and time stay.`)) return
    try {
      await api(`/api/admin/users/${u.id}`, { method: 'PATCH', body: { active } })
      notify(active ? `${u.name} reactivated.` : `${u.name} deactivated.`)
      await Promise.all([load(), refreshUsers()])
    } catch (e: any) {
      notify(e.message, 'error')
    }
  }

  const resetPassword = (u: StaffUser) =>
    setForm({ id: u.id, name: u.name, email: u.email, role: u.role, title: u.title, hourlyRate: String(u.hourlyRate ?? 0), weeklyCapacityHours: String(u.weeklyCapacityHours ?? 40), color: u.color, password: randomPassword() })

  if (!list) return <Loading />

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          Staff who can log in to this Workspace. <span className="text-zinc-500">Owners and managers manage everything; team members see only their projects and their own time.</span>
        </p>
        <Btn
          variant="primary"
          size="sm"
          onClick={() => setForm({ name: '', email: '', role: 'member', title: '', hourlyRate: '', weeklyCapacityHours: '40', color: COLORS[list.length % COLORS.length], password: randomPassword() })}
        >
          <Plus className="h-4 w-4" /> Add team member
        </Btn>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Rate</th>
                <th className="px-4 py-3">Last login</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 text-zinc-200">
              {list.map((u) => (
                <tr key={u.id} className={u.active ? '' : 'opacity-50'}>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2.5">
                      <Avatar user={u} size={30} />
                      <span>
                        <span className="block font-medium">
                          {u.name} {u.id === me.id && <span className="text-xs text-zinc-500">(you)</span>}
                        </span>
                        <span className="block text-[11px] text-zinc-500">
                          {u.title ? `${u.title} · ` : ''}
                          {u.email}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Pill className={u.role === 'member' ? 'border-zinc-700 text-zinc-300' : 'border-indigo-800 bg-indigo-950/50 text-indigo-300'}>{ROLE_LABEL[u.role]}</Pill>
                    {!u.active && <Pill className="ml-1 border-zinc-700 text-zinc-500">Inactive</Pill>}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{u.weeklyCapacityHours}h / week</td>
                  <td className="px-4 py-3 text-zinc-400">{u.hourlyRate ? `${inr(u.hourlyRate)}/h` : '—'}</td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Never'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Btn variant="ghost" size="sm" onClick={() => onViewTasks(u.id)}>
                        Tasks
                      </Btn>
                      <Btn variant="ghost" size="sm" onClick={() => onViewTimesheet(u.id)}>
                        Timesheet
                      </Btn>
                      {(me.role === 'owner' || u.role !== 'owner') && (
                        <>
                          <Btn
                            variant="ghost"
                            size="sm"
                            aria-label="Edit"
                            onClick={() => setForm({ id: u.id, name: u.name, email: u.email, role: u.role, title: u.title, hourlyRate: String(u.hourlyRate ?? 0), weeklyCapacityHours: String(u.weeklyCapacityHours ?? 40), color: u.color, password: '' })}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Btn>
                          <Btn variant="ghost" size="sm" aria-label="Reset password" title="Reset password" onClick={() => resetPassword(u)}>
                            <KeyRound className="h-3.5 w-3.5" />
                          </Btn>
                          {u.id !== me.id &&
                            (u.active ? (
                              <Btn variant="ghost" size="sm" aria-label="Deactivate" title="Deactivate" onClick={() => setActive(u, false)} className="text-rose-400">
                                <UserX className="h-3.5 w-3.5" />
                              </Btn>
                            ) : (
                              <Btn variant="ghost" size="sm" aria-label="Reactivate" title="Reactivate" onClick={() => setActive(u, true)} className="text-emerald-400">
                                <UserCheck className="h-3.5 w-3.5" />
                              </Btn>
                            ))}
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

      <Modal
        open={!!form}
        onClose={() => setForm(null)}
        title={form?.id ? (form.password ? `Reset password for ${form.name}` : 'Edit team member') : 'Add team member'}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setForm(null)}>
              Cancel
            </Btn>
            <Btn variant="primary" onClick={save} busy={busy}>
              {form?.id ? 'Save' : 'Add member'}
            </Btn>
          </>
        }
      >
        {form && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name">
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
            </Field>
            <Field label="Work email (login)">
              <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Job title">
              <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Full-stack Developer" />
            </Field>
            <Field label="Role">
              <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} disabled={form.id === me.id}>
                <option value="member">Team member — own projects, own time</option>
                <option value="manager">Manager — all projects, assigns work, reports</option>
                {me.role === 'owner' && <option value="owner">Owner — everything incl. deleting</option>}
              </select>
            </Field>
            <Field label="Hourly cost (₹)" hint="Used for cost reports. Visible to managers only.">
              <input type="number" min={0} className={inputCls} value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} />
            </Field>
            <Field label="Weekly capacity (hours)">
              <input type="number" min={0} max={80} className={inputCls} value={form.weeklyCapacityHours} onChange={(e) => setForm({ ...form, weeklyCapacityHours: e.target.value })} />
            </Field>
            <Field label="Colour" className="sm:col-span-2">
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setForm({ ...form, color: c })} className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-zinc-900 ${form.color === c ? 'ring-2 ring-white' : ''}`} style={{ background: c }} aria-label={c} />
                ))}
              </div>
            </Field>
            <Field
              label={form.id ? 'New password (leave empty to keep current)' : 'Temporary password'}
              className="sm:col-span-2"
              hint="Share it privately. They can change it after logging in (top bar → Change password)."
            >
              <div className="flex gap-2">
                <input className={`${inputCls} font-mono`} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <Btn variant="outline" onClick={() => setForm({ ...form, password: randomPassword() })}>
                  Generate
                </Btn>
              </div>
            </Field>
          </div>
        )}
      </Modal>

      <Modal open={!!shownPassword} onClose={() => setShownPassword(null)} title="Login details" footer={<Btn variant="primary" onClick={() => setShownPassword(null)}>Done</Btn>}>
        {shownPassword && (
          <div className="space-y-3 text-sm text-zinc-300">
            <p>Send these to {shownPassword.name} privately (e.g. WhatsApp). This password is not shown again.</p>
            <pre className="whitespace-pre-wrap rounded-lg bg-zinc-950 p-3 font-mono text-xs text-zinc-100">
              {`Login: ${typeof window !== 'undefined' ? window.location.origin : ''}/admin/login\nEmail: ${shownPassword.email}\nPassword: ${shownPassword.password}`}
            </pre>
          </div>
        )}
      </Modal>
    </div>
  )
}
