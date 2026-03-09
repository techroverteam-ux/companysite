'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Clock, DollarSign, TrendingUp } from 'lucide-react'
import { Navbar } from '@/components/navbar/navbar'
import { Footer } from '@/components/footer/footer'
import migrationData from '@/data/migration.json'

export default function MigrationPage() {
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
              MIGRATION
            </div>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
              {migrationData.hero.title}
            </h1>
            <p className="mx-auto mt-3 max-w-4xl text-lg font-medium text-foreground sm:text-xl">{migrationData.hero.subtitle}</p>
            <p className="mx-auto mt-3 max-w-4xl text-base leading-[1.85] text-muted-foreground sm:text-lg">{migrationData.hero.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Migration Strategies */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10 sm:mb-12">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              STRATEGIES
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Migration <span className="gradient-text">Strategies</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {migrationData.strategies.map((strategy, index) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="gradient-text">{strategy.name}</CardTitle>
                    <p className="text-muted-foreground">{strategy.description}</p>
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
                        <p className="text-sm text-muted-foreground mb-4">Best for: {strategy.bestFor}</p>
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
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10 sm:mb-12">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              TECHNOLOGIES
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Technology Migrations We <span className="gradient-text">Handle</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {migrationData.technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
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
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10 sm:mb-12">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              PROCESS
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Our Migration <span className="gradient-text">Process</span></h2>
          </div>
          <div className="space-y-8">
            {migrationData.process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex items-start"
              >
                <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white font-bold mr-6 flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-2">{step.description}</p>
                  <span className="text-sm text-secondary font-medium">Duration: {step.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl mb-6">Ready to Modernize Your <span className="gradient-text">Systems</span>?</h2>
          <p className="text-base leading-[1.85] text-muted-foreground sm:text-lg md:text-xl mb-8">Get a free migration assessment and cost estimate</p>
          <Button size="lg" variant="gradient" onClick={() => window.location.href = '/contact'}>
            Get Free Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}