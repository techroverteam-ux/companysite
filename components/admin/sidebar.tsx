'use client'

import {
  Users, MessageSquare, Calendar, Settings,
  Briefcase, Star, Building2, Package, LogOut, FileText, X,
  LayoutDashboard, FolderKanban, KanbanSquare, Clock, ShieldCheck,
  CalendarCheck, FileSignature, Receipt, BadgeCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout: () => void
  isOpen: boolean
  onClose: () => void
  role: 'owner' | 'manager' | 'member'
}

const menuGroups = [
  {
    category: 'Workspace',
    managerOnly: false,
    items: [
      { id: 'my-work', label: 'My Work', icon: LayoutDashboard },
      { id: 'tasks', label: 'Task Board', icon: KanbanSquare },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
      { id: 'timesheets', label: 'Timesheets', icon: Clock },
      { id: 'attendance', label: 'Attendance & Leave', icon: CalendarCheck },
      { id: 'staff', label: 'Staff & Roles', icon: ShieldCheck, managerOnly: true },
    ],
  },
  {
    category: 'Clients & Sales',
    managerOnly: true,
    items: [
      { id: 'contacts', label: 'Inquiries & Leads', icon: MessageSquare },
      { id: 'schedule', label: 'Meeting Requests', icon: Calendar },
      { id: 'clients', label: 'Clients & Accounts', icon: Building2 },
      { id: 'proposals', label: 'Proposals', icon: FileSignature },
      { id: 'invoices', label: 'Invoices', icon: Receipt },
      { id: 'client-reviews', label: 'Client Reviews', icon: BadgeCheck },
    ],
  },
  {
    category: 'Website Content',
    managerOnly: true,
    items: [
      { id: 'services', label: 'Services Catalog', icon: Briefcase },
      { id: 'portfolio', label: 'Projects & Deliverables', icon: Package },
      { id: 'case-studies', label: 'Case Studies', icon: FileText },
      { id: 'reviews', label: 'Old Testimonials (JSON)', icon: Star },
    ],
  },
  {
    category: 'Website Settings',
    managerOnly: true,
    items: [
      { id: 'site-team', label: 'Team Page Profiles', icon: Users },
      { id: 'settings', label: 'System Settings', icon: Settings },
    ],
  },
] as {
  category: string
  managerOnly: boolean
  items: { id: string; label: string; icon: typeof Users; managerOnly?: boolean }[]
}[]

export function AdminSidebar({ activeTab, setActiveTab, onLogout, isOpen, onClose, role }: SidebarProps) {
  const manager = role === 'owner' || role === 'manager'
  const groups = menuGroups
    .filter((g) => manager || !g.managerOnly)
    .map((g) => ({ ...g, items: g.items.filter((i) => manager || !i.managerOnly) }))
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-800 bg-zinc-950 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between border-b border-zinc-800 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20">
                <span className="font-bold text-white text-lg">T</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Techrover</h2>
                <p className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold">Workspace</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            {groups.map((group) => (
              <div key={group.category} className="space-y-1">
                <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  {group.category}
                </h3>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        onClose()
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                        {item.label}
                      </div>
                      {item.id === 'clients' && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-indigo-700 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                          CRM
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <Button onClick={onLogout} variant="outline" className="w-full border-zinc-800 bg-zinc-900 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white">
            <LogOut className="h-3.5 w-3.5 mr-2 text-rose-400" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  )
}