'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Clock, DollarSign, TrendingUp } from 'lucide-react'
import migrationData from '@/data/migration.json'

export default function MigrationPage() {
  return (
    <div className="pt-16">
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{migrationData.hero.title}</h1>
            <p className="text-xl md:text-2xl mb-4">{migrationData.hero.subtitle}</p>
            <p className="text-lg text-white/90 max-w-4xl mx-auto">{migrationData.hero.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Migration Strategies */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Migration Strategies</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {migrationData.strategies.map((strategy, index) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="gradient-text">{strategy.name}</CardTitle>
                    <p className="text-gray-600">{strategy.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-secondary mr-2" />
                        <span className="font-medium">{strategy.timeline}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-secondary mr-2" />
                        <span className="font-medium">{strategy.costRange}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Benefits:</h4>
                        <ul className="space-y-1">
                          {strategy.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-4">Best for: {strategy.bestFor}</p>
                        <Button variant="gradient" className="w-full" onClick={() => window.location.href = '/contact'}>
                          Choose This Strategy
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

      {/* Technology Migrations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Technology Migrations We Handle</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {migrationData.technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{tech.from}</h3>
                        <ArrowRight className="h-5 w-5 text-secondary my-2" />
                        <h3 className="font-semibold text-lg gradient-text">{tech.to}</h3>
                      </div>
                      <div className="text-right">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                          {tech.effort} Effort
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-green-600 font-medium">{tech.savings}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Migration Process</h2>
          <div className="space-y-8">
            {migrationData.process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start"
              >
                <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white font-bold mr-6 flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-2">{step.description}</p>
                  <span className="text-sm text-secondary font-medium">Duration: {step.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Modernize Your Systems?</h2>
          <p className="text-xl mb-8">Get a free migration assessment and cost estimate</p>
          <Button size="lg" variant="secondary" onClick={() => window.location.href = '/contact'}>
            Get Free Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}