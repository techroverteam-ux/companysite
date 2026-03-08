'use client'

import { 
  Users, MessageSquare, Calendar, Settings, 
  Briefcase, Star, Building2, Package, LogOut, FileText, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout: () => void
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'portfolio', label: 'Portfolio', icon: Package },
  { id: 'case-studies', label: 'Case Studies', icon: FileText },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'clients', label: 'Clients', icon: Building2 },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'contacts', label: 'Contacts', icon: MessageSquare },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar({ activeTab, setActiveTab, onLogout, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-700 bg-slate-900 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
      <div className="flex items-center justify-between border-b p-6 lg:block">
        <h2 className="text-xl font-bold text-white">TechRover Admin</h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                onClose()
              }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-slate-800 ${
                activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          )
        })}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <Button onClick={onLogout} variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      </aside>
    </>
  )
}