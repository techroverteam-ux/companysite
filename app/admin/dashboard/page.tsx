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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('services')
  const [services, setServices] = useState<any[]>([])
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
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
      const [servicesData, portfolioData, reviewsData, clientsData, teamData, contactData, scheduleData] = await Promise.all([
        import('@/data/services.json'),
        import('@/data/portfolio.json'),
        import('@/data/reviews.json'),
        import('@/data/clients.json'),
        import('@/data/team.json'),
        import('@/data/contact.json'),
        import('@/data/schedule.json')
      ])
      
      const parseData = (data: any) => {
        if (data.data && typeof data.data === 'string') {
          const decrypted = decrypt(data.data)
          return decrypted || []
        }
        return data || []
      }
      
      setServices(Array.isArray(parseData(servicesData.default)) ? parseData(servicesData.default) : [])
      setPortfolio(Array.isArray(parseData(portfolioData.default)) ? parseData(portfolioData.default) : [])
      setReviews(Array.isArray(parseData(reviewsData.default)) ? parseData(reviewsData.default) : [])
      setClients(Array.isArray(parseData(clientsData.default)) ? parseData(clientsData.default) : [])
      setTeam(Array.isArray(parseData(teamData.default)) ? parseData(teamData.default) : [])
      const contactDataParsed = parseData(contactData.default) || {}
      setContacts(Array.isArray(contactDataParsed.inquiries) ? contactDataParsed.inquiries : [])
      setSchedule(parseData(scheduleData.default) || {})
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
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />
      <AdminNavbar activeTab={activeTab} />
      
      <div className="ml-64 p-6">
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
                  const newService = { title: 'New Service', startingPrice: '₹0', description: 'Description', isActive: true }
                  setServices([...services, newService])
                }}
                onDelete={(index) => {
                  const updated = services.filter((_, i) => i !== index)
                  setServices(updated)
                }}
              />
              <div className="mt-4">
                <Button 
                  onClick={() => saveData('services', services)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
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
                onDelete={(index) => {
                  const updated = contacts.filter((_, i) => i !== index)
                  setContacts(updated)
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-sm text-gray-600">Confirmed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">0</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <div className="text-sm text-gray-600">Cancelled</div>
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
                  const newProject = { title: 'New Project', industry: 'Technology', description: 'Project description', status: 'Active' }
                  setPortfolio([...portfolio, newProject])
                }}
                onDelete={(index) => {
                  const updated = portfolio.filter((_, i) => i !== index)
                  setPortfolio(updated)
                }}
              />
              <div className="mt-4">
                <Button 
                  onClick={() => saveData('portfolio', portfolio)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
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
                  const newReview = { clientName: 'New Client', company: 'Company', rating: 5, review: 'Great service!' }
                  setReviews([...reviews, newReview])
                }}
                onDelete={(index) => {
                  const updated = reviews.filter((_, i) => i !== index)
                  setReviews(updated)
                }}
              />
              <div className="mt-4">
                <Button 
                  onClick={() => saveData('reviews', reviews)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'clients' && (
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>Manage client information</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={clients}
                columns={[
                  { key: 'name', label: 'Client Name' },
                  { key: 'country', label: 'Country' },
                  { key: 'industry', label: 'Industry' },
                  { key: 'email', label: 'Email' }
                ]}
                title="Clients"
                onAdd={() => {
                  const newClient = { name: 'New Client', country: 'India', industry: 'Technology', email: 'client@example.com' }
                  setClients([...clients, newClient])
                }}
                onDelete={(index) => {
                  const updated = clients.filter((_, i) => i !== index)
                  setClients(updated)
                }}
              />
              <div className="mt-4">
                <Button 
                  onClick={() => saveData('clients', clients)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
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
                  const newMember = { name: 'New Member', role: 'Developer', email: 'member@techrover.com', bio: 'Team member bio' }
                  setTeam([...team, newMember])
                }}
                onDelete={(index) => {
                  const updated = team.filter((_, i) => i !== index)
                  setTeam(updated)
                }}
              />
              <div className="mt-4">
                <Button 
                  onClick={() => saveData('team', team)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
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
    </div>
  )
}