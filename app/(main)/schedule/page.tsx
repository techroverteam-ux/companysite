'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Toast } from '@/components/ui/toast'
import { Calendar, Clock, User, CheckCircle } from 'lucide-react'
import scheduleData from '@/data/schedule.json'

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error', isVisible: false })

  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const handleBooking = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          meetingType: selectedType,
          date: selectedDate,
          time: selectedTime
        })
      })
      
      if (response.ok) {
        setToast({ message: 'Meeting scheduled successfully! You will receive a confirmation email shortly.', type: 'success', isVisible: true })
        setStep(1)
        setSelectedDate('')
        setSelectedTime('')
        setSelectedType('')
        setFormData({ name: '', email: '', phone: '', company: '', message: '' })
      } else {
        setToast({ message: 'Failed to schedule meeting. Please try again.', type: 'error', isVisible: true })
      }
    } catch (error) {
      setToast({ message: 'Error scheduling meeting. Please try again.', type: 'error', isVisible: true })
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
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Calendar className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Schedule a Call</h1>
            <p className="text-xl">Book a free consultation with our experts</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="gradient-text">Select Meeting Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {Array.isArray(scheduleData.meetingTypes) && scheduleData.meetingTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedType === type.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        <h3 className="font-semibold">{type.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                        <div className="flex items-center text-sm text-secondary">
                          <Clock className="h-4 w-4 mr-1" />
                          {type.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="gradient" 
                    className="w-full mt-6"
                    disabled={!selectedType}
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="gradient-text">Select Date & Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="date">Select Date</Label>
                      <Input
                        id="date"
                        type="date"
                        min={today}
                        max={maxDate}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>

                    {selectedDate && (
                      <div>
                        <Label>Available Time Slots</Label>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                          {Array.isArray(scheduleData.timeSlots) && scheduleData.timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-2 text-sm border rounded transition-all ${
                                selectedTime === time 
                                  ? 'border-primary bg-primary text-white' 
                                  : 'border-gray-200 hover:border-primary'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button 
                        variant="gradient" 
                        className="flex-1"
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => setStep(3)}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="gradient-text">Your Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                        <Label htmlFor="company">Company</Label>
                        <Input 
                        id="company" 
                        placeholder="Your Company" 
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                      />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us about your project or what you'd like to discuss..."
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Meeting Summary:</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Type:</strong> {Array.isArray(scheduleData.meetingTypes) ? scheduleData.meetingTypes.find(t => t.id === selectedType)?.name : 'N/A'}</p>
                        <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {selectedTime}</p>
                        <p><strong>Duration:</strong> {Array.isArray(scheduleData.meetingTypes) ? scheduleData.meetingTypes.find(t => t.id === selectedType)?.duration : 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button 
                        variant="gradient" 
                        className="flex-1"
                        onClick={handleBooking}
                        disabled={isSubmitting}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}