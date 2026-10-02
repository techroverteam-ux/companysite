'use client'

import { useState } from 'react'
import { KeyRound, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api, ROLE_LABEL, type Me } from '@/components/admin/work/lib'
import { Avatar, Btn, Field, inputCls, Modal } from '@/components/admin/work/ui'

interface NavbarProps {
  activeTab: string
  onOpenSidebar: () => void
  me: Me
  notify: (message: string, type?: 'success' | 'error') => void
}

const tabTitles: Record<string, [string, string]> = {
  'my-work': ['My Work', 'Your tasks, timer and today’s hours'],
  tasks: ['Task Board', 'Plan, assign and move work across stages'],
  projects: ['Projects', 'Client projects, teams, budgets and progress'],
  timesheets: ['Timesheets', 'Weekly time logs and reports'],
  staff: ['Staff & Roles', 'Who can log in, their role, rate and capacity'],
  services: ['Services Management', 'Services shown on the website'],
  portfolio: ['Portfolio Management', 'Projects shown on the website'],
  reviews: ['Reviews Management', 'Client testimonials on the website'],
  clients: ['Client Management', 'Accounts and contacts'],
  'site-team': ['Team Page Profiles', 'Public bios on the Team page'],
  contacts: ['Inquiries & Leads', 'Every website form submission'],
  schedule: ['Meeting Requests', 'Meetings booked from the website'],
  'case-studies': ['Case Studies', 'Detailed project stories'],
  settings: ['System Settings', 'Global website settings'],
}

export function AdminNavbar({ activeTab, onOpenSidebar, me, notify }: NavbarProps) {
  const [title, subtitle] = tabTitles[activeTab] ?? ['Dashboard', '']
  const [open, setOpen] = useState(false)
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [busy, setBusy] = useState(false)

  const changePassword = async () => {
    if (pw.newPassword !== pw.confirm) return notify('The new passwords do not match.', 'error')
    setBusy(true)
    try {
      await api('/api/auth/password', { method: 'POST', body: { currentPassword: pw.currentPassword, newPassword: pw.newPassword } })
      notify('Password changed.')
      setOpen(false)
      setPw({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (e: any) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 px-4 py-4 backdrop-blur-sm lg:ml-64 lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" className="mt-0.5 text-zinc-300 lg:hidden" onClick={onOpenSidebar} aria-label="Open sidebar">
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-zinc-100 lg:text-2xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white sm:flex" title="Change password">
            <KeyRound className="h-3.5 w-3.5" /> Change password
          </button>
          <div className="flex items-center gap-2">
            <Avatar user={me} size={32} />
            <div className="hidden leading-tight sm:block">
              <div className="text-sm font-medium text-zinc-100">{me.name}</div>
              <div className="text-[11px] text-zinc-500">{ROLE_LABEL[me.role]}</div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Change your password"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Btn>
            <Btn variant="primary" onClick={changePassword} busy={busy} disabled={!pw.currentPassword || pw.newPassword.length < 10}>
              Change password
            </Btn>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Current password">
            <input type="password" autoComplete="current-password" className={inputCls} value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
          </Field>
          <Field label="New password" hint="At least 10 characters.">
            <input type="password" autoComplete="new-password" className={inputCls} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
          </Field>
          <Field label="Repeat new password">
            <input type="password" autoComplete="new-password" className={inputCls} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
