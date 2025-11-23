'use client'

import { 
  LayoutDashboard, Users, MessageSquare, Calendar, Settings, 
  Briefcase, Star, Building2, Package, LogOut 
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout: () => void
}

const menuItems = [
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'portfolio', label: 'Portfolio', icon: Package },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'clients', label: 'Clients', icon: Building2 },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'contacts', label: 'Contacts', icon: MessageSquare },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 h-screen fixed left-0 top-0 z-20">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-white">TechRover Admin</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
    </div>
  )
}