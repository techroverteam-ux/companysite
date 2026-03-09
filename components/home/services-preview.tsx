'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Database, Code, TrendingUp, Palette, ArrowRight, Smartphone, Cloud, Shield, Link, BarChart3, Wifi, ShoppingCart, CheckCircle } from 'lucide-react'

const iconMap = {
  Brain,
  Database,
  Code,
  TrendingUp,
  Palette,
  Smartphone,
  Cloud,
  Shield,
  Link,
  BarChart3,
  Wifi,
  ShoppingCart,
}

interface Service {
  title: string
  icon: string
  description: string
}

interface ServicesPreviewProps {
  services: Service[]
}

export function ServicesPreview({ services }: ServicesPreviewProps) {
  const sectionEase = [0.22, 1, 0.36, 1] as const

  return (
    <section className="relative overflow-hidden bg-muted/50 py-14 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-secondary/[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: sectionEase }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-10 text-center sm:mb-12"
        >
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
            WHAT WE DO
          </div>

          <h2 className="mx-auto max-w-4xl text-balance text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Our <span className="gradient-text">Services</span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-[1.85] text-muted-foreground sm:text-lg">
            Comprehensive technology solutions designed to transform your business and drive growth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] || Brain
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: sectionEase }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card className="group h-full border-border/70 bg-card/80 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <CardHeader className="pb-3 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/20 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-5 text-sm leading-[1.75] text-muted-foreground">
                      {service.description}
                    </CardDescription>
                    <Button variant="ghost" size="sm" className="text-muted-foreground transition-colors group-hover:text-primary" onClick={() => window.location.href = '/services'}>
                      Learn More
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: sectionEase }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 text-center sm:mt-14"
        >
          <Button size="lg" variant="gradient" onClick={() => window.location.href = '/services'}>
            View All Services
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}