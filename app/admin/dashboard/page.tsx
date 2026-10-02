'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminNavbar } from '@/components/admin/navbar'
import { decrypt } from '@/lib/auth'
import { Toast } from '@/components/ui/toast'
import { DataTable } from '@/components/ui/data-table'
import { ClientManagement, ClientRecord } from '@/components/admin/client-management'
import { WorkspaceProvider } from '@/components/admin/work/context'
import { DARK_TABS, WorkspaceScreens } from '@/components/admin/work/screens'
import { api, isManager, type Me } from '@/components/admin/work/lib'

const MANAGER_ONLY_TABS = ['clients', 'contacts', 'schedule', 'services', 'portfolio', 'case-studies', 'reviews', 'site-team', 'settings', 'staff', 'proposals', 'invoices', 'client-reviews']

export default function AdminDashboard() {
  const router = useRouter()
  const [me, setMe] = useState<Me | null>(null)
  const [activeTab, setActiveTab] = useState('my-work')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [caseStudies, setCaseStudies] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [clients, setClients] = useState<ClientRecord[]>([])
  const [clientsVersion, setClientsVersion] = useState(0)
  const [team, setTeam] = useState<any[]>([])
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'error',
  })

  const notify = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ isVisible: true, message, type })
  }, [])

  useEffect(() => {
    api<{ user: Me }>('/api/auth/me')
      .then((res) => setMe(res.user))
      .catch(() => router.replace('/admin/login'))
  }, [router])

  useEffect(() => {
    if (me && isManager(me)) fetchContent()
  }, [me])

  // Team members only get the Workspace screens.
  useEffect(() => {
    if (me && !isManager(me) && MANAGER_ONLY_TABS.includes(activeTab)) setActiveTab('my-work')
  }, [me, activeTab])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    router.replace('/admin/login')
  }

  async function fetchContent() {
    try {
      const [servicesData, portfolioData, reviewsData, clientsRes, teamData, caseStudiesData] = await Promise.all([
        import('@/data/services.json'),
        import('@/data/portfolio.json'),
        import('@/data/reviews.json'),
        api<{ clients: ClientRecord[] }>('/api/admin/clients').catch(() => ({ clients: [] as ClientRecord[] })),
        import('@/data/team.json'),
        import('@/data/case-studies.json'),
      ])

      const parseData = (data: any) => {
        const value = data?.default ?? data
        if (value && typeof value.data === 'string') {
          return decrypt(value.data) || []
        }
        return value || []
      }

      const asArray = (v: any) => (Array.isArray(v) ? v : [])
      setServices(asArray(parseData(servicesData)))
      setPortfolio(asArray(parseData(portfolioData)))
      setReviews(asArray(parseData(reviewsData)))
      setClients(clientsRes.clients)
      setClientsVersion((v) => v + 1)
      setTeam(asArray(parseData(teamData)))
      setCaseStudies(asArray(parseData(caseStudiesData)))
    } catch (error) {
      console.error('Error loading website content:', error)
    }
  }

  const saveData = async (type: string, data: any) => {
    try {
      const res = await fetch(`/api/data/${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || `Save failed (${res.status})`)
      notify('Data saved successfully!')
    } catch (error: any) {
      console.error('Error saving data:', error)
      notify(error.message || 'Failed to save data. Please try again.', 'error')
    }
  }

  if (!me) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">Loading…</div>
  }


  return (
    <WorkspaceProvider me={me} notify={notify}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          role={me.role}
        />
        <AdminNavbar activeTab={activeTab} onOpenSidebar={() => setIsSidebarOpen(true)} me={me} notify={notify} onNavigate={setActiveTab} />

        <div className={`p-4 lg:ml-64 lg:p-6 ${DARK_TABS.includes(activeTab) ? 'min-h-[calc(100vh-81px)] bg-zinc-950' : ''}`}>
          <WorkspaceScreens activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'services' && (
            <Card>
              <CardHeader>
                <CardTitle>Services Management</CardTitle>
                <CardDescription>Manage your service offerings</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={services}
                  columns={[
                    { key: 'title', label: 'Service Name' },
                    { key: 'startingPrice', label: 'Starting Price' },
                    { key: 'description', label: 'Description' },
                    { key: 'isActive', label: 'Status' }
                  ]}
                  title="Services"
                  onAdd={() => {
                    const newService = { id: `service-${Date.now()}`, title: 'New Service', startingPrice: '₹10,000', description: 'Description', isActive: true }
                    const updated = [...services, newService]
                    setServices(updated)
                    saveData('services', updated)
                  }}
                  onEdit={(updatedItem, index) => {
                    const updated = [...services]
                    updated[index] = updatedItem
                    setServices(updated)
                    saveData('services', updated)
                  }}
                  onDelete={(index) => {
                    const updated = services.filter((_, i) => i !== index)
                    setServices(updated)
                    saveData('services', updated)
                  }}
                />
              </CardContent>
            </Card>
          )}
          {activeTab === 'portfolio' && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Management</CardTitle>
                <CardDescription>Manage your project portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={portfolio}
                  columns={[
                    { key: 'title', label: 'Project Name' },
                    { key: 'industry', label: 'Industry' },
                    { key: 'description', label: 'Description' },
                    { key: 'status', label: 'Status' }
                  ]}
                  title="Projects"
                  onAdd={() => {
                    const newProject = { id: `project-${Date.now()}`, title: 'New Project', industry: 'Technology', description: 'Project description', status: 'Active' }
                    const updated = [...portfolio, newProject]
                    setPortfolio(updated)
                    saveData('portfolio', updated)
                  }}
                  onEdit={(updatedItem, index) => {
                    const updated = [...portfolio]
                    updated[index] = updatedItem
                    setPortfolio(updated)
                    saveData('portfolio', updated)
                  }}
                  onDelete={(index) => {
                    const updated = portfolio.filter((_, i) => i !== index)
                    setPortfolio(updated)
                    saveData('portfolio', updated)
                  }}
                />
              </CardContent>
            </Card>
          )}
          {activeTab === 'reviews' && (
            <Card>
              <CardHeader>
                <CardTitle>Reviews Management</CardTitle>
                <CardDescription>Manage client testimonials</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={reviews}
                  columns={[
                    { key: 'clientName', label: 'Client Name' },
                    { key: 'company', label: 'Company' },
                    { key: 'rating', label: 'Rating' },
                    { key: 'review', label: 'Review' }
                  ]}
                  title="Client Reviews"
                  onAdd={() => {
                    const newReview = { id: `review-${Date.now()}`, clientName: 'New Client', company: 'Company', rating: 5, review: 'Great service!' }
                    const updated = [...reviews, newReview]
                    setReviews(updated)
                    saveData('reviews', updated)
                  }}
                  onEdit={(updatedItem, index) => {
                    const updated = [...reviews]
                    updated[index] = updatedItem
                    setReviews(updated)
                    saveData('reviews', updated)
                  }}
                  onDelete={(index) => {
                    const updated = reviews.filter((_, i) => i !== index)
                    setReviews(updated)
                    saveData('reviews', updated)
                  }}
                />
              </CardContent>
            </Card>
          )}
          {activeTab === 'clients' && (
            <ClientManagement
              key={clientsVersion}
              clients={clients}
              portfolioData={portfolio}
              caseStudiesData={caseStudies}
              servicesData={services}
              onSaveClients={async (updatedClients) => {
                try {
                  const res = await api<{ clients: ClientRecord[] }>('/api/admin/clients', { method: 'PUT', body: { clients: updatedClients } })
                  setClients(res.clients)
                  // Remount only when new ids came back (so edits keep their place).
                  if (res.clients.length !== updatedClients.length || updatedClients.some((c) => !/^[a-f\d]{24}$/i.test(String(c.id)))) setClientsVersion((v) => v + 1)
                  notify('Clients saved.')
                } catch (e: any) {
                  notify(e.message, 'error')
                }
              }}
              onTriggerToast={(message, type) => {
                notify(message, type)
              }}
            />
          )}
          {activeTab === 'site-team' && (
            <Card>
              <CardHeader>
                <CardTitle>Website Team Profiles</CardTitle>
                <CardDescription>Public bios shown on the Team page (not logins — manage logins under Staff &amp; Roles)</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={team}
                  columns={[
                    { key: 'name', label: 'Name' },
                    { key: 'role', label: 'Role' },
                    { key: 'email', label: 'Email' },
                    { key: 'bio', label: 'Bio' }
                  ]}
                  title="Team Members"
                  onAdd={() => {
                    const newMember = { id: `team-${Date.now()}`, name: 'New Member', role: 'Developer', email: 'member@techrover.com', bio: 'Team member bio' }
                    const updated = [...team, newMember]
                    setTeam(updated)
                    saveData('team', updated)
                  }}
                  onEdit={(updatedItem, index) => {
                    const updated = [...team]
                    updated[index] = updatedItem
                    setTeam(updated)
                    saveData('team', updated)
                  }}
                  onDelete={(index) => {
                    const updated = team.filter((_, i) => i !== index)
                    setTeam(updated)
                    saveData('team', updated)
                  }}
                />
              </CardContent>
            </Card>
          )}
          {activeTab === 'case-studies' && (
            <Card>
              <CardHeader>
                <CardTitle>Case Studies Management</CardTitle>
                <CardDescription>Manage detailed project case studies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Case studies management coming soon</p>
                  <Button onClick={() => window.open('/portfolio', '_blank')}>
                    View Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>Website Settings</CardTitle>
                <CardDescription>Configure global website settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="site-title">Site Title</Label>
                    <Input id="site-title" defaultValue="Techrover - Global Technology Solutions" />
                  </div>
                  <div>
                    <Label htmlFor="site-description">Site Description</Label>
                    <Textarea id="site-description" defaultValue="Leading technology partner delivering AI solutions, ERP systems, web development, and digital marketing services to businesses worldwide." />
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Toast
          isVisible={toast.isVisible}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        />
      </div>
    </WorkspaceProvider>
  )
}
