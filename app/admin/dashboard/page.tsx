'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Save, LogOut } from 'lucide-react'
import { AdminLogin } from '@/components/admin/login'
import { getAuthToken, validateToken, removeAuthToken, encrypt, decrypt } from '@/lib/auth'
import { showToast } from '@/components/ui/toast'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('services')
  const [services, setServices] = useState<any[]>([])
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [team, setTeam] = useState<any[]>([])
  const [migration, setMigration] = useState<any>({})
  const [aiAgents, setAiAgents] = useState<any>({})
  const [products, setProducts] = useState<any>({})
  const [collaboration, setCollaboration] = useState<any>({})
  const [marketing, setMarketing] = useState<any>({})
  const [calculator, setCalculator] = useState<any>({})
  const [schedule, setSchedule] = useState<any>({})
  const [contacts, setContacts] = useState<any[]>([])

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
      // Load existing data from JSON files
      const [servicesData, portfolioData, reviewsData, clientsData, teamData, migrationData, aiAgentsData, productsData, collaborationData, marketingData, calculatorData, scheduleDataImport] = await Promise.all([
        import('@/data/services.json'),
        import('@/data/portfolio.json'),
        import('@/data/reviews.json'),
        import('@/data/clients.json'),
        import('@/data/team.json'),
        import('@/data/migration.json'),
        import('@/data/ai-agents.json'),
        import('@/data/products.json'),
        import('@/data/collaboration.json'),
        import('@/data/marketing.json'),
        import('@/data/calculator.json'),
import('@/data/schedule.json')
      ])
      
      // Handle both encrypted and plain data
      const parseData = (data: any) => {
        if (data.data && typeof data.data === 'string') {
          // Encrypted data
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
      setMigration(parseData(migrationData.default) || {})
      setAiAgents(parseData(aiAgentsData.default) || {})
      setProducts(parseData(productsData.default) || {})
      setCollaboration(parseData(collaborationData.default) || {})
      setMarketing(parseData(marketingData.default) || {})
      setCalculator(parseData(calculatorData.default) || {})
      const scheduleDataParsed = parseData(scheduleDataImport.default) || {}
      setSchedule(scheduleDataParsed)
      setContacts(Array.isArray(scheduleDataParsed.contacts) ? scheduleDataParsed.contacts : [])
    } catch (error) {
      console.error('Error fetching data:', error)
      // Initialize with empty arrays if loading fails
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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: encryptedData })
      })
      showToast('success', 'Data saved successfully!')
    } catch (error) {
      console.error('Error saving data:', error)
      showToast('error', 'Failed to save data. Please try again.')
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your website content</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="migration">Migration</TabsTrigger>
            <TabsTrigger value="ai-agents">AI Agents</TabsTrigger>
            <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="hire-team">Hire Team</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Services</CardTitle>
                <CardDescription>
                  Add, edit, or remove services from your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(services) && services.map((service: any, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`service-title-${index}`}>Title</Label>
                          <Input
                            id={`service-title-${index}`}
                            value={service.title}
                            onChange={(e) => {
                              const updated = [...services]
                              updated[index].title = e.target.value
                              setServices(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`service-price-${index}`}>Starting Price</Label>
                          <Input
                            id={`service-price-${index}`}
                            value={service.startingPrice}
                            onChange={(e) => {
                              const updated = [...services]
                              updated[index].startingPrice = e.target.value
                              setServices(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <select 
                            value={service.isActive ? 'active' : 'inactive'}
                            onChange={(e) => {
                              const updated = [...services]
                              updated[index].isActive = e.target.value === 'active'
                              setServices(updated)
                            }}
                            className="w-full p-2 border rounded"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor={`service-start-${index}`}>Start Date</Label>
                          <Input
                            id={`service-start-${index}`}
                            type="date"
                            value={service.startDate || ''}
                            onChange={(e) => {
                              const updated = [...services]
                              updated[index].startDate = e.target.value
                              setServices(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`service-end-${index}`}>End Date</Label>
                          <Input
                            id={`service-end-${index}`}
                            type="date"
                            value={service.endDate || ''}
                            onChange={(e) => {
                              const updated = [...services]
                              updated[index].endDate = e.target.value
                              setServices(updated)
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor={`service-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`service-desc-${index}`}
                          value={service.description}
                          onChange={(e) => {
                            const updated = [...services]
                            updated[index].description = e.target.value
                            setServices(updated)
                          }}
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          onClick={() => {
                            const updated = services.filter((_, i) => i !== index)
                            setServices(updated)
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        const newService = { 
                          title: 'New Service', 
                          startingPrice: '₹0', 
                          description: 'Service description',
                          isActive: true,
                          startDate: new Date().toISOString().split('T')[0],
                          endDate: ''
                        }
                        setServices([...(Array.isArray(services) ? services : []), newService])
                      }}
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Service
                    </Button>
                    <Button 
                      onClick={() => saveData('services', services)}
                      variant="gradient"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Services
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Portfolio</CardTitle>
                <CardDescription>
                  Showcase your best projects and case studies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(portfolio) && portfolio.map((project: any, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                          <Input
                            id={`project-title-${index}`}
                            value={project.title}
                            onChange={(e) => {
                              const updated = [...portfolio]
                              updated[index].title = e.target.value
                              setPortfolio(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`project-industry-${index}`}>Industry</Label>
                          <Input
                            id={`project-industry-${index}`}
                            value={project.industry}
                            onChange={(e) => {
                              const updated = [...portfolio]
                              updated[index].industry = e.target.value
                              setPortfolio(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <select 
                            value={project.isActive ? 'active' : 'inactive'}
                            onChange={(e) => {
                              const updated = [...portfolio]
                              updated[index].isActive = e.target.value === 'active'
                              setPortfolio(updated)
                            }}
                            className="w-full p-2 border rounded"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor={`project-start-${index}`}>Start Date</Label>
                          <Input
                            id={`project-start-${index}`}
                            type="date"
                            value={project.startDate || ''}
                            onChange={(e) => {
                              const updated = [...portfolio]
                              updated[index].startDate = e.target.value
                              setPortfolio(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`project-end-${index}`}>End Date</Label>
                          <Input
                            id={`project-end-${index}`}
                            type="date"
                            value={project.endDate || ''}
                            onChange={(e) => {
                              const updated = [...portfolio]
                              updated[index].endDate = e.target.value
                              setPortfolio(updated)
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor={`project-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`project-desc-${index}`}
                          value={project.description}
                          onChange={(e) => {
                            const updated = [...portfolio]
                            updated[index].description = e.target.value
                            setPortfolio(updated)
                          }}
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          onClick={() => {
                            const updated = portfolio.filter((_, i) => i !== index)
                            setPortfolio(updated)
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        const newProject = { 
                          title: 'New Project', 
                          industry: 'Technology', 
                          description: 'Project description',
                          isActive: true,
                          startDate: new Date().toISOString().split('T')[0],
                          endDate: ''
                        }
                        setPortfolio([...(Array.isArray(portfolio) ? portfolio : []), newProject])
                      }}
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                    <Button 
                      onClick={() => saveData('portfolio', portfolio)}
                      variant="gradient"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Portfolio
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Reviews</CardTitle>
                <CardDescription>
                  Client testimonials and feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(reviews) && reviews.map((review: any, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`review-client-${index}`}>Client Name</Label>
                          <Input
                            id={`review-client-${index}`}
                            value={review.clientName}
                            onChange={(e) => {
                              const updated = [...reviews]
                              updated[index].clientName = e.target.value
                              setReviews(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`review-company-${index}`}>Company</Label>
                          <Input
                            id={`review-company-${index}`}
                            value={review.company}
                            onChange={(e) => {
                              const updated = [...reviews]
                              updated[index].company = e.target.value
                              setReviews(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`review-rating-${index}`}>Rating</Label>
                          <Input
                            id={`review-rating-${index}`}
                            type="number"
                            min="1"
                            max="5"
                            value={review.rating || 5}
                            onChange={(e) => {
                              const updated = [...reviews]
                              updated[index].rating = parseInt(e.target.value)
                              setReviews(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <select 
                            value={review.isActive ? 'active' : 'inactive'}
                            onChange={(e) => {
                              const updated = [...reviews]
                              updated[index].isActive = e.target.value === 'active'
                              setReviews(updated)
                            }}
                            className="w-full p-2 border rounded"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor={`review-date-${index}`}>Review Date</Label>
                          <Input
                            id={`review-date-${index}`}
                            type="date"
                            value={review.reviewDate || ''}
                            onChange={(e) => {
                              const updated = [...reviews]
                              updated[index].reviewDate = e.target.value
                              setReviews(updated)
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor={`review-text-${index}`}>Review</Label>
                        <Textarea
                          id={`review-text-${index}`}
                          value={review.review}
                          onChange={(e) => {
                            const updated = [...reviews]
                            updated[index].review = e.target.value
                            setReviews(updated)
                          }}
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          onClick={() => {
                            const updated = reviews.filter((_, i) => i !== index)
                            setReviews(updated)
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        const newReview = { 
                          clientName: 'New Client', 
                          company: 'Company Name', 
                          review: 'Review text', 
                          rating: 5,
                          isActive: true,
                          reviewDate: new Date().toISOString().split('T')[0]
                        }
                        setReviews([...(Array.isArray(reviews) ? reviews : []), newReview])
                      }}
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Review
                    </Button>
                    <Button 
                      onClick={() => saveData('reviews', reviews)}
                      variant="gradient"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Reviews
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Clients</CardTitle>
                <CardDescription>
                  Client information and project history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(clients) && clients.map((client: any, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`client-name-${index}`}>Client Name</Label>
                          <Input
                            id={`client-name-${index}`}
                            value={client.name}
                            onChange={(e) => {
                              const updated = [...clients]
                              updated[index].name = e.target.value
                              setClients(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`client-country-${index}`}>Country</Label>
                          <Input
                            id={`client-country-${index}`}
                            value={client.country}
                            onChange={(e) => {
                              const updated = [...clients]
                              updated[index].country = e.target.value
                              setClients(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`client-industry-${index}`}>Industry</Label>
                          <Input
                            id={`client-industry-${index}`}
                            value={client.industry}
                            onChange={(e) => {
                              const updated = [...clients]
                              updated[index].industry = e.target.value
                              setClients(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`client-email-${index}`}>Email</Label>
                          <Input
                            id={`client-email-${index}`}
                            type="email"
                            value={client.email || ''}
                            onChange={(e) => {
                              const updated = [...clients]
                              updated[index].email = e.target.value
                              setClients(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`client-phone-${index}`}>Phone</Label>
                          <Input
                            id={`client-phone-${index}`}
                            value={client.phone || ''}
                            onChange={(e) => {
                              const updated = [...clients]
                              updated[index].phone = e.target.value
                              setClients(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <select 
                            value={client.isActive ? 'active' : 'inactive'}
                            onChange={(e) => {
                              const updated = [...clients]
                              updated[index].isActive = e.target.value === 'active'
                              setClients(updated)
                            }}
                            className="w-full p-2 border rounded"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor={`client-start-${index}`}>Contract Start</Label>
                          <Input
                            id={`client-start-${index}`}
                            type="date"
                            value={client.contractStart || ''}
                            onChange={(e) => {
                              const updated = [...clients]
                              updated[index].contractStart = e.target.value
                              setClients(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`client-end-${index}`}>Contract End</Label>
                          <Input
                            id={`client-end-${index}`}
                            type="date"
                            value={client.contractEnd || ''}
                            onChange={(e) => {
                              const updated = [...clients]
                              updated[index].contractEnd = e.target.value
                              setClients(updated)
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          onClick={() => {
                            const updated = clients.filter((_, i) => i !== index)
                            setClients(updated)
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        const newClient = {
                          name: 'New Client',
                          country: 'India',
                          industry: 'Technology',
                          email: 'client@example.com',
                          phone: '+91 98765 43210',
                          isActive: true,
                          contractStart: new Date().toISOString().split('T')[0],
                          contractEnd: ''
                        }
                        setClients([...(Array.isArray(clients) ? clients : []), newClient])
                      }}
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Client
                    </Button>
                    <Button 
                      onClick={() => saveData('clients', clients)}
                      variant="gradient"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Clients
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Team</CardTitle>
                <CardDescription>
                  Team members and their information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(team) && team.map((member: any, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`member-name-${index}`}>Name</Label>
                          <Input
                            id={`member-name-${index}`}
                            value={member.name}
                            onChange={(e) => {
                              const updated = [...team]
                              updated[index].name = e.target.value
                              setTeam(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`member-role-${index}`}>Role</Label>
                          <Input
                            id={`member-role-${index}`}
                            value={member.role}
                            onChange={(e) => {
                              const updated = [...team]
                              updated[index].role = e.target.value
                              setTeam(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`member-email-${index}`}>Email</Label>
                          <Input
                            id={`member-email-${index}`}
                            type="email"
                            value={member.email || ''}
                            onChange={(e) => {
                              const updated = [...team]
                              updated[index].email = e.target.value
                              setTeam(updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <select 
                            value={member.isActive ? 'active' : 'inactive'}
                            onChange={(e) => {
                              const updated = [...team]
                              updated[index].isActive = e.target.value === 'active'
                              setTeam(updated)
                            }}
                            className="w-full p-2 border rounded"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor={`member-join-${index}`}>Join Date</Label>
                          <Input
                            id={`member-join-${index}`}
                            type="date"
                            value={member.joinDate || ''}
                            onChange={(e) => {
                              const updated = [...team]
                              updated[index].joinDate = e.target.value
                              setTeam(updated)
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor={`member-bio-${index}`}>Bio</Label>
                        <Textarea
                          id={`member-bio-${index}`}
                          value={member.bio}
                          onChange={(e) => {
                            const updated = [...team]
                            updated[index].bio = e.target.value
                            setTeam(updated)
                          }}
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          onClick={() => {
                            const updated = team.filter((_, i) => i !== index)
                            setTeam(updated)
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        const newMember = {
                          name: 'New Team Member',
                          role: 'Developer',
                          bio: 'Team member bio',
                          email: 'member@techrover.com',
                          isActive: true,
                          joinDate: new Date().toISOString().split('T')[0]
                        }
                        setTeam([...(Array.isArray(team) ? team : []), newMember])
                      }}
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                    <Button 
                      onClick={() => saveData('team', team)}
                      variant="gradient"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Team
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="migration" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Migration Services</CardTitle>
                <CardDescription>
                  Migration strategies and technology offerings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="migration-title">Page Title</Label>
                    <Input 
                      id="migration-title" 
                      value={migration.hero?.title || ''}
                      onChange={(e) => {
                        const updated = { ...migration }
                        if (!updated.hero) updated.hero = {}
                        updated.hero.title = e.target.value
                        setMigration(updated)
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="migration-subtitle">Subtitle</Label>
                    <Textarea 
                      id="migration-subtitle" 
                      value={migration.hero?.subtitle || ''}
                      onChange={(e) => {
                        const updated = { ...migration }
                        if (!updated.hero) updated.hero = {}
                        updated.hero.subtitle = e.target.value
                        setMigration(updated)
                      }}
                    />
                  </div>
                  <Button 
                    onClick={() => saveData('migration', migration)}
                    variant="gradient"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Migration Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-agents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage AI Agents</CardTitle>
                <CardDescription>
                  AI automation solutions and pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ai-title">Page Title</Label>
                    <Input 
                      id="ai-title" 
                      value={aiAgents.hero?.title || ''}
                      onChange={(e) => {
                        const updated = { ...aiAgents }
                        if (!updated.hero) updated.hero = {}
                        updated.hero.title = e.target.value
                        setAiAgents(updated)
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ai-subtitle">Subtitle</Label>
                    <Textarea 
                      id="ai-subtitle" 
                      value={aiAgents.hero?.subtitle || ''}
                      onChange={(e) => {
                        const updated = { ...aiAgents }
                        if (!updated.hero) updated.hero = {}
                        updated.hero.subtitle = e.target.value
                        setAiAgents(updated)
                      }}
                    />
                  </div>
                  <Button 
                    onClick={() => saveData('ai-agents', aiAgents)}
                    variant="gradient"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save AI Agents Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Products</CardTitle>
                <CardDescription>
                  Showcase of Techrover's product portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="products-title">Page Title</Label>
                    <Input 
                      id="products-title" 
                      value={products.hero?.title || ''}
                      onChange={(e) => {
                        const updated = { ...products }
                        if (!updated.hero) updated.hero = {}
                        updated.hero.title = e.target.value
                        setProducts(updated)
                      }}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">Products</h4>
                    {Array.isArray(products.products) && products.products.map((product: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`product-name-${index}`}>Product Name</Label>
                            <Input
                              id={`product-name-${index}`}
                              value={product.name}
                              onChange={(e) => {
                                const updated = { ...products }
                                updated.products[index].name = e.target.value
                                setProducts(updated)
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`product-category-${index}`}>Category</Label>
                            <Input
                              id={`product-category-${index}`}
                              value={product.category}
                              onChange={(e) => {
                                const updated = { ...products }
                                updated.products[index].category = e.target.value
                                setProducts(updated)
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`product-website-${index}`}>Website</Label>
                            <Input
                              id={`product-website-${index}`}
                              value={product.website}
                              onChange={(e) => {
                                const updated = { ...products }
                                updated.products[index].website = e.target.value
                                setProducts(updated)
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`product-status-${index}`}>Status</Label>
                            <Input
                              id={`product-status-${index}`}
                              value={product.status}
                              onChange={(e) => {
                                const updated = { ...products }
                                updated.products[index].status = e.target.value
                                setProducts(updated)
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label htmlFor={`product-desc-${index}`}>Description</Label>
                          <Textarea
                            id={`product-desc-${index}`}
                            value={product.description}
                            onChange={(e) => {
                              const updated = { ...products }
                              updated.products[index].description = e.target.value
                              setProducts(updated)
                            }}
                          />
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button 
                            onClick={() => {
                              const updated = { ...products }
                              updated.products = updated.products.filter((_: any, i: number) => i !== index)
                              setProducts(updated)
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        const newProduct = {
                          id: `product-${Date.now()}`,
                          name: 'New Product',
                          category: 'Technology',
                          description: 'Product description',
                          website: '#',
                          status: 'In Development',
                          features: [],
                          technologies: [],
                          impact: 'New impact metric'
                        }
                        const updated = { ...products }
                        if (!updated.products) updated.products = []
                        updated.products = [...updated.products, newProduct]
                        setProducts(updated)
                      }}
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                    <Button 
                      onClick={() => saveData('products', products)}
                      variant="gradient"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Products Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaborate" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Collaboration</CardTitle>
                <CardDescription>
                  Developer partnership and collaboration opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="collab-title">Page Title</Label>
                    <Input 
                      id="collab-title" 
                      value={collaboration.hero?.title || ''}
                      onChange={(e) => {
                        const updated = { ...collaboration }
                        if (!updated.hero) updated.hero = {}
                        updated.hero.title = e.target.value
                        setCollaboration(updated)
                      }}
                    />
                  </div>
                  <Button 
                    onClick={() => saveData('collaboration', collaboration)}
                    variant="gradient"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Collaboration Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Marketing Campaigns</CardTitle>
                <CardDescription>
                  Control promotional banners and special offers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="campaign-active"
                      checked={marketing.activeCampaign?.isActive || false}
                      onChange={(e) => {
                        const updated = { ...marketing }
                        if (!updated.activeCampaign) updated.activeCampaign = {}
                        updated.activeCampaign.isActive = e.target.checked
                        setMarketing(updated)
                      }}
                    />
                    <Label htmlFor="campaign-active">Campaign Active</Label>
                  </div>
                  <div>
                    <Label htmlFor="campaign-title">Campaign Title</Label>
                    <Input 
                      id="campaign-title" 
                      value={marketing.activeCampaign?.banner?.title || ''}
                      onChange={(e) => {
                        const updated = { ...marketing }
                        if (!updated.activeCampaign) updated.activeCampaign = {}
                        if (!updated.activeCampaign.banner) updated.activeCampaign.banner = {}
                        updated.activeCampaign.banner.title = e.target.value
                        setMarketing(updated)
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="campaign-discount">Discount Percentage</Label>
                    <Input 
                      id="campaign-discount" 
                      value={marketing.activeCampaign?.banner?.discount || ''}
                      onChange={(e) => {
                        const updated = { ...marketing }
                        if (!updated.activeCampaign) updated.activeCampaign = {}
                        if (!updated.activeCampaign.banner) updated.activeCampaign.banner = {}
                        updated.activeCampaign.banner.discount = e.target.value
                        setMarketing(updated)
                      }}
                    />
                  </div>
                  <Button 
                    onClick={() => saveData('marketing', marketing)}
                    variant="gradient"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Marketing Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Pricing & Hourly Rates</CardTitle>
                <CardDescription>
                  Update service pricing and team hourly rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-4">Service Base Prices</h4>
                    <div className="space-y-3">
                      {Array.isArray(calculator.services) && calculator.services.map((service: any, index: number) => (
                        <div key={service.id} className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>{service.name}</Label>
                          </div>
                          <div>
                            <Input
                              type="number"
                              value={service.basePrice}
                              onChange={(e) => {
                                const updated = { ...calculator }
                                updated.services[index].basePrice = parseInt(e.target.value)
                                setCalculator(updated)
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Team Hourly Rates</h4>
                    <div className="space-y-3">
                      {Array.isArray(calculator.teamRoles) && calculator.teamRoles.map((role: any, index: number) => (
                        <div key={role.role} className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>{role.role}</Label>
                          </div>
                          <div>
                            <Input
                              type="number"
                              value={role.hourlyRate}
                              onChange={(e) => {
                                const updated = { ...calculator }
                                updated.teamRoles[index].hourlyRate = parseInt(e.target.value)
                                setCalculator(updated)
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => saveData('calculator', calculator)}
                    variant="gradient"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Pricing Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Bookings</CardTitle>
                <CardDescription>
                  View and manage scheduled meetings from website visitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-600">Total Bookings</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">0</div>
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
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3">Recent Bookings</h4>
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>No meetings scheduled yet.</p>
                      <p className="text-sm mt-1">Bookings from the schedule page will appear here.</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-3">📅 Meeting Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Available Meeting Types:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Free Consultation (30 min)</li>
                          <li>• Project Discussion (60 min)</li>
                          <li>• Technical Review (45 min)</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Working Hours:</h5>
                        <p className="text-sm text-gray-600">Monday - Friday</p>
                        <p className="text-sm text-gray-600">9:00 AM - 6:00 PM IST</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.location.href = '/schedule'}>
                      View Schedule Page
                    </Button>
                    <Button variant="gradient" onClick={() => window.location.href = 'mailto:hello@techrover.co.in'}>
                      Send Meeting Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Form Submissions</CardTitle>
                <CardDescription>
                  View and manage contact form inquiries from website visitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Recent Inquiries</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <div>
                          <div className="font-medium">Nitesh Verma</div>
                          <div className="text-sm text-gray-600">niteshneriya@gmail.com • Anand Rathi IT Pvt Ltd</div>
                          <div className="text-xs text-gray-500 mt-1">Oct 20, 2025 at 7:07 AM</div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">New</span>
                          <Button size="sm" variant="outline" onClick={() => window.location.href = 'mailto:niteshneriya@gmail.com'}>Reply</Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <div>
                          <div className="font-medium">Ashok Verma</div>
                          <div className="text-sm text-gray-600">ashokverma.an.2001@gmail.com • Anand Rathi IT Pvt Ltd</div>
                          <div className="text-xs text-gray-500 mt-1">Oct 20, 2025 at 7:10 AM</div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">New</span>
                          <Button size="sm" variant="outline" onClick={() => window.location.href = 'mailto:ashokverma.an.2001@gmail.com'}>Reply</Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <div>
                          <div className="font-medium">Radhika Machine Tools</div>
                          <div className="text-sm text-gray-600">9983813366@ybl • Radhika Machine Tools</div>
                          <div className="text-xs text-gray-500 mt-1">Oct 20, 2025 at 7:11 AM</div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">New</span>
                          <Button size="sm" variant="outline" onClick={() => window.location.href = 'mailto:9983813366@ybl'}>Reply</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-sm text-gray-600">Total Inquiries</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">3</div>
                      <div className="text-sm text-gray-600">New Inquiries</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">0</div>
                      <div className="text-sm text-gray-600">Responded</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold mb-2">💡 Quick Actions</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => window.location.href = '/contact'}>View Contact Page</Button>
                      <Button size="sm" variant="gradient" onClick={() => window.location.href = 'mailto:hello@techrover.co.in'}>Send Bulk Email</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hire-team" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Hire Team Requests</CardTitle>
                <CardDescription>
                  Manage freelance team requests and assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">50+</div>
                      <div className="text-sm text-gray-600">Available Developers</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">15</div>
                      <div className="text-sm text-gray-600">Active Projects</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">8</div>
                      <div className="text-sm text-gray-600">Pending Requests</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">₹25L</div>
                      <div className="text-sm text-gray-600">Monthly Revenue</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Recent Requests</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">E-commerce Mobile App</div>
                          <div className="text-sm text-gray-600">John Doe • ₹8,00,000 • 4 months</div>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Pending</span>
                          <Button size="sm" variant="outline">Review</Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">SaaS Dashboard</div>
                          <div className="text-sm text-gray-600">Sarah Wilson • ₹12,00,000 • 6 months</div>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Assigned</span>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Team Availability</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Frontend Developers</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                          </div>
                          <span className="text-sm">12/16 available</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Backend Developers</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{width: '50%'}}></div>
                          </div>
                          <span className="text-sm">8/16 available</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">UI/UX Designers</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '83%'}}></div>
                          </div>
                          <span className="text-sm">10/12 available</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Mobile Developers</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{width: '25%'}}></div>
                          </div>
                          <span className="text-sm">2/8 available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Settings</CardTitle>
                <CardDescription>
                  Configure global website settings
                </CardDescription>
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
                  <Button variant="gradient">
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}