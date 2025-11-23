'use client'

import { Bell, Search, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  activeTab: string
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

export function AdminNavbar({ activeTab }: NavbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 ml-64 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {tabTitles[activeTab] || 'Dashboard'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your website content and settings
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
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
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>
    </div>
  )
}