'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Users, Lightbulb, Code, Rocket, CheckCircle, Send } from 'lucide-react'
import collaborationData from '@/data/collaboration.json'

export default function CollaboratePage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', experience: '', collaborationType: '', idea: '', portfolio: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/collaboration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        alert('Thank you! We will review your proposal and get back to you within 48 hours.')
        setFormData({ name: '', email: '', phone: '', experience: '', collaborationType: '', idea: '', portfolio: '' })
      } else {
        alert('Failed to submit proposal. Please try again.')
      }
    } catch (error) {
      alert('Error submitting proposal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="pt-16">
      <section className="bg-muted/50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              PARTNERSHIPS
            </div>
            <Users className="h-12 w-12 mx-auto mb-6 text-primary" />
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
              {collaborationData.hero.title}
            </h1>
            <p className="mx-auto mt-3 max-w-4xl text-lg font-medium text-foreground sm:text-xl">{collaborationData.hero.subtitle}</p>
            <p className="mx-auto mt-3 max-w-4xl text-base leading-[1.85] text-muted-foreground sm:text-lg">{collaborationData.hero.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Collaboration Opportunities */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10 sm:mb-12">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              OPPORTUNITIES
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Collaboration <span className="gradient-text">Opportunities</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {collaborationData.opportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="gradient-text">{opportunity.title}</CardTitle>
                    <p className="text-muted-foreground">{opportunity.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Benefits:</h4>
                        <ul className="space-y-1">
                          {opportunity.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Requirements:</h4>
                        <ul className="space-y-1">
                          {opportunity.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-center text-sm text-muted-foreground">
                              <Code className="h-4 w-4 text-muted-foreground/60 mr-2" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-4">
                          <strong>Commitment:</strong> {opportunity.commitment}
                        </p>
                        <Button variant="gradient" className="w-full" onClick={() => document.getElementById('collaboration-form')?.scrollIntoView({ behavior: 'smooth' })}>
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-12 sm:py-16 bg-muted/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10 sm:mb-12">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              FOCUS AREAS
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Our Focus <span className="gradient-text">Areas</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {collaborationData.focus_areas.map((area, index) => (
              <motion.div
                key={area.area}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Lightbulb className="h-8 w-8 text-secondary mr-3" />
                      <h3 className="text-xl font-semibold gradient-text">{area.area}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{area.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {area.technologies.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Process */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10 sm:mb-12">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              PROCESS
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">How We <span className="gradient-text">Collaborate</span></h2>
          </div>
          <div className="space-y-8">
            {collaborationData.process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex items-start"
              >
                <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white font-bold mr-6 flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Form */}
      <section id="collaboration-form" className="py-12 sm:py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl gradient-text text-center">Start Your Collaboration Journey</CardTitle>
                <p className="text-center text-muted-foreground">Share your idea or express interest in partnering with us</p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Your Name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        placeholder="+91 98765 43210" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Experience</Label>
                      <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md">
                        <option>0-2 years</option>
                        <option>2-5 years</option>
                        <option>5-10 years</option>
                        <option>10+ years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="collaboration-type">Collaboration Type</Label>
                    <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md">
                      <option>Developer Partnership</option>
                      <option>Startup Collaboration</option>
                      <option>Open Source Contribution</option>
                      <option>Innovation Lab</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="idea">Your Idea / Proposal</Label>
                    <Textarea 
                      id="idea" 
                      placeholder="Describe your innovative idea, technical skills, or how you'd like to collaborate with us..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="portfolio">Portfolio / GitHub</Label>
                    <Input id="portfolio" placeholder="https://github.com/yourusername or portfolio link" />
                  </div>
                  
                  <Button variant="gradient" size="lg" className="w-full" type="submit" disabled={isSubmitting}>
                    <Send className="mr-2 h-5 w-5" />
                    {isSubmitting ? 'Submitting...' : 'Submit Collaboration Proposal'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}