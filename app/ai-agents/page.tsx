'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, Zap, Clock, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'
import { Navbar } from '@/components/navbar/navbar'
import { Footer } from '@/components/footer/footer'
import aiAgentsData from '@/data/ai-agents.json'

export default function AIAgentsPage() {
  return (
    <>
      <Navbar />
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
              AI SOLUTIONS
            </div>
            <Bot className="h-12 w-12 mx-auto mb-6 text-primary" />
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
              {aiAgentsData.hero.title}
            </h1>
            <p className="mx-auto mt-3 max-w-4xl text-lg font-medium text-foreground sm:text-xl">{aiAgentsData.hero.subtitle}</p>
            <p className="mx-auto mt-3 max-w-4xl text-base leading-[1.85] text-muted-foreground sm:text-lg">{aiAgentsData.hero.description}</p>
          </motion.div>
        </div>
      </section>

      {/* AI Agents */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10 sm:mb-12">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              OUR AGENTS
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Our AI <span className="gradient-text">Agents</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {aiAgentsData.agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <Bot className="h-8 w-8 text-secondary mr-3" />
                      <CardTitle className="gradient-text">{agent.name}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{agent.description}</p>
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
      <section className="py-12 sm:py-16 bg-muted/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10 sm:mb-12">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              CAPABILITIES
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">AI <span className="gradient-text">Capabilities</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiAgentsData.capabilities.map((capability, index) => (
              <motion.div
                key={capability.category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card className="text-center">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4 gradient-text">{capability.category}</h3>
                    <ul className="space-y-2">
                      {capability.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">{feature}</li>
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
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10 sm:mb-12">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              PROCESS
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Implementation <span className="gradient-text">Process</span></h2>
          </div>
          <div className="space-y-8">
            {aiAgentsData.implementation.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
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
                      <li key={idx} className="flex items-center text-muted-foreground">
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
      <section className="py-12 sm:py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl mb-6">Ready to Automate Your <span className="gradient-text">Business</span>?</h2>
          <p className="text-base leading-[1.85] text-muted-foreground sm:text-lg md:text-xl mb-8">Start with a free consultation to identify automation opportunities</p>
          <Button size="lg" variant="gradient" onClick={() => window.location.href = '/contact'}>
            Get Free Consultation
          </Button>
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}