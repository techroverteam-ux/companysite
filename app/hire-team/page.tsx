'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Users, Code, Palette, Database, Smartphone, Globe, CheckCircle, ArrowRight } from 'lucide-react'

const teamRoles = [
  {
    role: "Frontend Developer",
    icon: Code,
    skills: ["React", "Next.js", "Vue.js", "Angular", "TypeScript"],
    hourlyRate: "₹1,500 - ₹3,500",
    experience: "2-8 years",
    available: 12
  },
  {
    role: "Backend Developer", 
    icon: Database,
    skills: ["Node.js", "Python", "Java", "PHP", "MongoDB"],
    hourlyRate: "₹2,000 - ₹4,000",
    experience: "3-10 years",
    available: 8
  },
  {
    role: "Full Stack Developer",
    icon: Globe,
    skills: ["MERN", "MEAN", "Django", "Laravel", "Next.js"],
    hourlyRate: "₹2,500 - ₹5,000",
    experience: "4-12 years",
    available: 6
  },
  {
    role: "UI/UX Designer",
    icon: Palette,
    skills: ["Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator"],
    hourlyRate: "₹1,200 - ₹2,800",
    experience: "2-6 years",
    available: 10
  },
  {
    role: "Mobile Developer",
    icon: Smartphone,
    skills: ["React Native", "Flutter", "iOS", "Android", "Kotlin"],
    hourlyRate: "₹2,200 - ₹4,500",
    experience: "3-8 years",
    available: 5
  }
]

export default function HireTeamPage() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [formData, setFormData] = useState({
    projectTitle: '',
    description: '',
    budget: '',
    timeline: '',
    contactName: '',
    email: '',
    phone: ''
  })

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/hire-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          selectedRoles
        })
      })
      
      if (response.ok) {
        alert('Request submitted! Our team will contact you within 24 hours.')
        setFormData({
          projectTitle: '',
          description: '',
          budget: '',
          timeline: '',
          contactName: '',
          email: '',
          phone: ''
        })
        setSelectedRoles([])
      } else {
        alert('Failed to submit request. Please try again.')
      }
    } catch (error) {
      alert('Error submitting request. Please try again.')
    }
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-muted/50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              BUILD YOUR TEAM
            </div>
            <div className="flex items-center justify-center mb-6">
              <Users className="h-12 w-12 mr-4 text-primary" />
              <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
                Hire Your <span className="gradient-text">Dream Team</span>
              </h1>
            </div>
            <p className="mx-auto mt-3 max-w-4xl text-base leading-[1.85] text-muted-foreground sm:text-lg md:text-xl">
              Get access to our network of 50+ skilled developers, designers, and tech experts for your project
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Roles Section */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-10 sm:mb-12"
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              TEAM MEMBERS
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl mb-4">
              Choose Your <span className="gradient-text">Team Members</span>
            </h2>
            <p className="text-base leading-[1.85] text-muted-foreground sm:text-lg max-w-3xl mx-auto">
              Select from our pool of experienced developers and designers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {teamRoles.map((member, index) => (
              <motion.div
                key={member.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedRoles.includes(member.role) 
                      ? 'border-primary bg-primary/5 shadow-lg' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleRole(member.role)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-4">
                          <member.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{member.role}</CardTitle>
                          <div className="text-sm text-muted-foreground">{member.experience}</div>
                        </div>
                      </div>
                      {selectedRoles.includes(member.role) && (
                        <CheckCircle className="h-6 w-6 text-primary" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-foreground/80 mb-1">Skills:</div>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.slice(0, 3).map(skill => (
                            <span key={skill} className="px-2 py-1 bg-muted text-foreground/80 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-muted-foreground">Hourly Rate</div>
                          <div className="font-semibold text-primary">{member.hourlyRate}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Available</div>
                          <div className="font-semibold text-green-600">{member.available} devs</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="py-12 sm:py-16 bg-muted/40">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tell Us About Your <span className="gradient-text">Project</span>
            </h2>
          </motion.div>

          <Card>
            <CardContent className="p-5 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input
                      id="projectTitle"
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                      placeholder="E.g., E-commerce Mobile App"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      placeholder="E.g., ₹5,00,000 - ₹10,00,000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your project requirements..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="contactName">Your Name</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {selectedRoles.length > 0 && (
                  <div>
                    <Label>Selected Team Roles</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedRoles.map(role => (
                        <span key={role} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Button type="submit" size="lg" variant="gradient" className="w-full">
                  Submit Request
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}