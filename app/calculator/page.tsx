'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calculator, Clock, Users, IndianRupee, Download } from 'lucide-react'
import calculatorData from '@/data/calculator.json'
import teamData from '@/data/team.json'

export default function CostCalculatorPage() {
  const [selectedService, setSelectedService] = useState('')
  const [complexity, setComplexity] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [estimate, setEstimate] = useState({
    totalCost: 0,
    totalHours: 0,
    timeline: '',
    teamEffort: [] as any[]
  })

  const calculateEstimate = () => {
    if (!selectedService || !complexity) return

    const service = calculatorData.services.find(s => s.id === selectedService)
    if (!service) return

    const complexityData = service.complexity[complexity as keyof typeof service.complexity]
    let totalCost = service.basePrice * complexityData.multiplier
    let totalHours = complexityData.hours

    // Add feature costs
    features.forEach(featureId => {
      const feature = calculatorData.additionalFeatures.find(f => f.name === featureId)
      if (feature) {
        totalCost += feature.cost
        totalHours += feature.hours
      }
    })

    // Calculate timeline (assuming 8 hours per day, 5 days per week)
    const workingDaysPerWeek = 5
    const hoursPerDay = 8
    const weeks = Math.ceil(totalHours / (workingDaysPerWeek * hoursPerDay))
    const timeline = weeks <= 4 ? `${weeks} weeks` : `${Math.ceil(weeks/4)} months`

    // Calculate team effort
    const teamEffort = calculatorData.teamRoles.map(role => ({
      role: role.role,
      hours: Math.round(totalHours * role.allocation),
      cost: Math.round(totalHours * role.allocation * role.hourlyRate),
      member: teamData.find(m => m.role.includes(role.role.split(' ')[0]))?.name || 'TBD'
    }))

    setEstimate({ totalCost, totalHours, timeline, teamEffort })
  }

  useEffect(() => {
    calculateEstimate()
  }, [selectedService, complexity, features])

  const generateQuote = () => {
    const quoteData = {
      service: calculatorData.services.find(s => s.id === selectedService)?.name,
      complexity,
      features,
      estimate,
      timestamp: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(quoteData, null, 2)
    const dataBlob = new Blob([dataStr], {type: 'application/json'})
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'techrover-quote.json'
    link.click()
  }

  return (
    <div className="pt-16">
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Calculator className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Project Cost Calculator</h1>
            <p className="text-xl">Get instant estimates with timeline and team allocation</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Calculator Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="gradient-text">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Select Service</Label>
                    <select 
                      className="w-full mt-2 p-3 border rounded-lg"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                    >
                      <option value="">Choose a service...</option>
                      {calculatorData.services.map(service => (
                        <option key={service.id} value={service.id}>{service.name}</option>
                      ))}
                    </select>
                  </div>

                  {selectedService && (
                    <div>
                      <Label>Project Complexity</Label>
                      <div className="mt-2 space-y-2">
                        {Object.entries(calculatorData.services.find(s => s.id === selectedService)?.complexity || {}).map(([key, data]) => (
                          <label key={key} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="complexity"
                              value={key}
                              checked={complexity === key}
                              onChange={(e) => setComplexity(e.target.value)}
                              className="mr-3"
                            />
                            <div>
                              <div className="font-medium capitalize">{key}</div>
                              <div className="text-sm text-gray-600">{data.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Additional Features</Label>
                    <div className="mt-2 space-y-2">
                      {calculatorData.additionalFeatures.map(feature => (
                        <label key={feature.name} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={features.includes(feature.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFeatures([...features, feature.name])
                              } else {
                                setFeatures(features.filter(f => f !== feature.name))
                              }
                            }}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{feature.name}</div>
                            <div className="text-sm text-gray-600">₹{feature.cost.toLocaleString('en-IN')} • {feature.hours}h</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Estimate Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {estimate.totalCost > 0 && (
                <>
                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gradient-text">
                        <IndianRupee className="mr-2 h-5 w-5" />
                        Cost Estimate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-primary mb-2">
                        ₹{estimate.totalCost.toLocaleString('en-IN')}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="mr-2 h-4 w-4" />
                        {estimate.totalHours} hours • {estimate.timeline}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gradient-text">
                        <Users className="mr-2 h-5 w-5" />
                        Team Allocation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {estimate.teamEffort.map((member, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">{member.role}</div>
                              <div className="text-sm text-gray-600">{member.member}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">₹{member.cost.toLocaleString('en-IN')}</div>
                              <div className="text-sm text-gray-600">{member.hours}h</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <Button 
                      variant="gradient" 
                      size="lg" 
                      className="w-full"
                      onClick={() => window.location.href = '/contact'}
                    >
                      Request Detailed Quote
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full"
                      onClick={generateQuote}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Estimate
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}