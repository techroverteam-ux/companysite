'use client'

import { Bell, Search, User, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  activeTab: string
  onOpenSidebar: () => void
}

const tabTitles: Record<string, string> = {
  services: 'Services Management',
  portfolio: 'Portfolio Management', 
  reviews: 'Reviews Management',
  clients: 'Client Management',
  team: 'Team Management',
  contacts: 'Contact Inquiries',
  schedule: 'Meeting Schedule',
  settings: 'System Settings'
}

export function AdminNavbar({ activeTab, onOpenSidebar }: NavbarProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95 lg:ml-64 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="mt-0.5 lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-slate-100 lg:text-2xl">
            {tabTitles[activeTab] || 'Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Manage your website content and settings
          </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-64"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="hidden text-sm font-medium dark:text-slate-200 sm:inline">Admin</span>
          </div>
        </div>
      </div>
    </div>
  )
}