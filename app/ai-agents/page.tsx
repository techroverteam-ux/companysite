'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, Zap, Clock, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'
import aiAgentsData from '@/data/ai-agents.json'

export default function AIAgentsPage() {
  return (
    <div className="pt-16">
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Bot className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{aiAgentsData.hero.title}</h1>
            <p className="text-xl md:text-2xl mb-4">{aiAgentsData.hero.subtitle}</p>
            <p className="text-lg text-white/90 max-w-4xl mx-auto">{aiAgentsData.hero.description}</p>
          </motion.div>
        </div>
      </section>

      {/* AI Agents */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our AI Agents</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {aiAgentsData.agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <Bot className="h-8 w-8 text-secondary mr-3" />
                      <CardTitle className="gradient-text">{agent.name}</CardTitle>
                    </div>
                    <p className="text-gray-600">{agent.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          {agent.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <div className="flex items-center mb-1">
                            <DollarSign className="h-4 w-4 text-secondary mr-1" />
                            <span className="text-sm font-medium">Monthly</span>
                          </div>
                          <p className="font-bold text-lg">{agent.pricing}</p>
                        </div>
                        <div>
                          <div className="flex items-center mb-1">
                            <Zap className="h-4 w-4 text-secondary mr-1" />
                            <span className="text-sm font-medium">Setup</span>
                          </div>
                          <p className="font-bold text-lg">{agent.setup}</p>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-700 font-medium">{agent.roi}</span>
                        </div>
                      </div>
                      
                      <Button variant="gradient" className="w-full" onClick={() => window.location.href = '/contact'}>
                        Deploy This Agent
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">AI Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiAgentsData.capabilities.map((capability, index) => (
              <motion.div
                key={capability.category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4 gradient-text">{capability.category}</h3>
                    <ul className="space-y-2">
                      {capability.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Implementation Process</h2>
          <div className="space-y-8">
            {aiAgentsData.implementation.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex items-start"
              >
                <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white font-bold mr-6 flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{phase.phase}</h3>
                  <div className="flex items-center mb-3">
                    <Clock className="h-4 w-4 text-secondary mr-2" />
                    <span className="text-secondary font-medium">{phase.duration}</span>
                  </div>
                  <ul className="space-y-1">
                    {phase.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Automate Your Business?</h2>
          <p className="text-xl mb-8">Start with a free consultation to identify automation opportunities</p>
          <Button size="lg" variant="secondary" onClick={() => window.location.href = '/contact'}>
            Get Free Consultation
          </Button>
        </div>
      </section>
    </div>
  )
}