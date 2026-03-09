'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Database, Code, TrendingUp, Palette, ArrowRight, CheckCircle, Smartphone, Cloud, Shield, Link, BarChart3, Wifi, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import servicesData from '@/data/services.json'

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

export default function ServicesPage() {


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
              WHAT WE DO
            </div>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="mx-auto mt-5 max-w-4xl text-base leading-[1.85] text-muted-foreground sm:text-lg md:text-xl">
              Comprehensive technology solutions designed to transform your business and drive sustainable growth
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8">
            {Array.isArray(servicesData) && servicesData.map((service, index) => {
              const Icon = iconMap[service?.icon as keyof typeof iconMap] || Code
              return (
                <motion.div
                  key={service?.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="grid lg:grid-cols-3 gap-0">
                      {/* Service Image */}
                      <div className="relative h-48 sm:h-56 lg:h-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-10" />
                        <Image
                          src={service.image || '/images/services/default-service.jpg'}
                          alt={service.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE3NSAxMjVIMjI1TDIwMCAxNTBaIiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE3NSAxNzVIMjI1TDIwMCAxNTBaIiBmaWxsPSIjOUI5QkEzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QkEzIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+'
                          }}
                        />
                        <div className="absolute top-4 left-4 z-20">
                          <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                      </div>

                      {/* Service Details */}
                      <CardHeader className="p-5 sm:p-8 lg:col-span-1">
                        <div className="mb-4">
                          <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                          <div className="text-sm text-secondary font-semibold">
                            Starting from {service.startingPrice}
                          </div>
                        </div>
                        <CardDescription className="text-muted-foreground text-lg mb-6">
                          {service.description}
                        </CardDescription>
                        <Button variant="gradient" className="w-fit" onClick={() => window.location.href = '/contact'}>
                          Get Quote
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardHeader>
                      
                      {/* Service Features */}
                      <CardContent className="p-5 sm:p-8 bg-muted/40 lg:col-span-1">
                        <h4 className="font-semibold text-lg mb-4">What's Included:</h4>
                        <ul className="space-y-3 mb-6">
                          {Array.isArray(service.subServices) && service.subServices.map((subService, idx) => (
                            <li key={idx} className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                              <span className="text-foreground/80 text-sm">{subService}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <h4 className="font-semibold text-lg mb-3">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(service.technologies) && service.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's discuss your project and create a custom solution that drives results
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="gradient" onClick={() => window.location.href = '/contact'}>
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.location.href = '/schedule'}>
                Schedule Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}