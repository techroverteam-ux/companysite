'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Save, LogOut } from 'lucide-react'
import { AdminLogin } from '@/components/admin/login'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminNavbar } from '@/components/admin/navbar'
import { getAuthToken, validateToken, removeAuthToken, encrypt, decrypt } from '@/lib/auth'
import { Toast } from '@/components/ui/toast'
import { Calendar } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'

import { ClientManagement, ClientRecord } from '@/components/admin/client-management'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('clients')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [caseStudies, setCaseStudies] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [clients, setClients] = useState<ClientRecord[]>([])
  const [team, setTeam] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [schedule, setSchedule] = useState<any>({})
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'error',
  })

  useEffect(() => {
    const token = getAuthToken()
    if (token && validateToken(token)) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    removeAuthToken()
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  const fetchData = async () => {
    try {
      const [servicesData, portfolioData, reviewsData, clientsData, teamData, contactData, scheduleData, caseStudiesData] = await Promise.all([
        import('@/data/services.json'),
        import('@/data/portfolio.json'),
        import('@/data/reviews.json'),
        import('@/data/clients.json'),
        import('@/data/team.json'),
        import('@/data/contact.json'),
        import('@/data/schedule.json'),
        import('@/data/case-studies.json')
      ])
      
      const parseData = (data: any) => {
        if (data.data && typeof data.data === 'string') {
          const decrypted = decrypt(data.data)
          return decrypted || []
        }
        return data.default || data || []
      }
      
      setServices(Array.isArray(parseData(servicesData)) ? parseData(servicesData) : [])
      setPortfolio(Array.isArray(parseData(portfolioData)) ? parseData(portfolioData) : [])
      setReviews(Array.isArray(parseData(reviewsData)) ? parseData(reviewsData) : [])
      setClients(Array.isArray(parseData(clientsData)) ? parseData(clientsData) : [])
      setTeam(Array.isArray(parseData(teamData)) ? parseData(teamData) : [])
      setCaseStudies(Array.isArray(parseData(caseStudiesData)) ? parseData(caseStudiesData) : [])
      const contactDataParsed = parseData(contactData) || {}
      setContacts(Array.isArray(contactDataParsed.inquiries) ? contactDataParsed.inquiries : [])
      setSchedule(parseData(scheduleData) || {})
    } catch (error) {
      console.error('Error fetching data:', error)
      setServices([])
      setPortfolio([])
      setReviews([])
      setClients([])
      setTeam([])
    }
  }

  const saveData = async (type: string, data: any) => {
    try {
      const encryptedData = encrypt(data)
      const token = getAuthToken()

      await fetch(`/api/data/${type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: encryptedData }),
      })

      setToast({
        isVisible: true,
        message: 'Data saved successfully!',
        type: 'success',
      })
    } catch (error) {
      console.error('Error saving data:', error)
      setToast({
        isVisible: true,
        message: 'Failed to save data. Please try again.',
        type: 'error',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <AdminNavbar activeTab={activeTab} onOpenSidebar={() => setIsSidebarOpen(true)} />
      
      <div className="p-4 lg:ml-64 lg:p-6">
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

        {activeTab === 'contacts' && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Inquiries</CardTitle>
              <CardDescription>Manage contact form submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={contacts}
                columns={[
                  { key: 'firstName', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'company', label: 'Company' },
                  { key: 'message', label: 'Message' },
                  { key: 'status', label: 'Status' }
                ]}
                title="Contact Submissions"
                onEdit={(updatedItem, index) => {
                  const updated = [...contacts]
                  updated[index] = updatedItem
                  setContacts(updated)
                  saveData('contact', { inquiries: updated })
                }}
                onDelete={(index) => {
                  const updated = contacts.filter((_, i) => i !== index)
                  setContacts(updated)
                  saveData('contact', { inquiries: updated })
                }}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'schedule' && (
          <Card>
            <CardHeader>
              <CardTitle>Meeting Schedule</CardTitle>
              <CardDescription>Manage scheduled meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-blue-950/40">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-950/40">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Confirmed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg dark:bg-yellow-950/40">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg dark:bg-red-950/40">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Cancelled</div>
                </div>
              </div>
              <DataTable
                data={[]}
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'date', label: 'Date' },
                  { key: 'time', label: 'Time' },
                  { key: 'status', label: 'Status' }
                ]}
                title="Scheduled Meetings"
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
            clients={clients}
            portfolioData={portfolio}
            caseStudiesData={caseStudies}
            servicesData={services}
            onSaveClients={(updatedClients) => {
              setClients(updatedClients)
              saveData('clients', updatedClients)
            }}
            onTriggerToast={(message, type) => {
              setToast({ isVisible: true, message, type })
            }}
          />
        )}

        {activeTab === 'team' && (
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage team members</CardDescription>
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
  )
}