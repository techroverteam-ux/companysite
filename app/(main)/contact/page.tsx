'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Toast } from '@/components/ui/toast'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', company: '', service: '', message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error', isVisible: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setToast({ message: 'Message sent successfully! We will contact you soon.', type: 'success', isVisible: true })
        setFormData({ firstName: '', lastName: '', email: '', company: '', service: '', message: '' })
      } else {
        setToast({ message: 'Failed to send message. Please try again.', type: 'error', isVisible: true })
      }
    } catch (error) {
      setToast({ message: 'Error sending message. Please try again.', type: 'error', isVisible: true })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="pt-16">
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      <section className="bg-muted/50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              GET IN TOUCH
            </div>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
              <span className="gradient-text">Contact</span> Us
            </h1>
            <p className="mx-auto mt-5 max-w-4xl text-base leading-[1.85] text-muted-foreground sm:text-lg md:text-xl">
              Ready to transform your business? Let&apos;s discuss your project
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text">Get In Touch</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          placeholder="John" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Doe" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@company.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company" 
                        placeholder="Your Company" 
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="service">Service Interested In</Label>
                      <select 
                        className="w-full h-11 px-3 py-2 border border-input bg-background rounded-md text-sm sm:text-base"
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                        required
                      >
                        <option>AI Development</option>
                        <option>ERP Systems</option>
                        <option>Web Development</option>
                        <option>Digital Marketing</option>
                        <option>Branding & Design</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us about your project..."
                        className="min-h-[120px]"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />
                    </div>
                    
                    <Button variant="gradient" size="lg" className="w-full" type="submit" disabled={isSubmitting}>
                      <Send className="mr-2 h-5 w-5" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Mail className="h-6 w-6 text-secondary mr-3" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground">hello@techrover.co.in</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Phone className="h-6 w-6 text-secondary mr-3" />
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-6 w-6 text-secondary mr-3" />
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="text-muted-foreground">Mumbai, India</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="h-6 w-6 text-secondary mr-3" />
                    <div>
                      <h3 className="font-semibold">Business Hours</h3>
                      <p className="text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM IST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Quick Response</h3>
                <p className="text-muted-foreground mb-6">
                  Need immediate assistance? We typically respond within 2 hours during business hours.
                </p>
                <Button variant="outline" size="lg" onClick={() => window.location.href = '/schedule'}>
                  Schedule Call
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}