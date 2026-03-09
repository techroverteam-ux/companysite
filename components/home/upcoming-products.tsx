'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  GraduationCap, 
  Heart, 
  Brain, 
  Users, 
  Calendar, 
  Shield,
  Zap,
  Star,
  ArrowRight,
  Bell
} from 'lucide-react'

const upcomingProducts = [
  {
    id: 'eduverse',
    name: 'EduVerse',
    tagline: 'AI-Powered School Management Revolution',
    description: 'Complete school management system with ground-level AI implementations for enhanced learning experiences',
    icon: GraduationCap,
    color: 'from-blue-500 to-purple-600',
    launchDate: 'Q2 2026',
    status: 'In Development',
    features: [
      'AI-powered student performance analytics',
      'Intelligent attendance tracking',
      'Personalized learning paths',
      'Smart parent-teacher communication',
      'Automated report generation',
      'Predictive academic insights'
    ],
    aiFeatures: [
      'Natural language query system',
      'Behavioral pattern analysis',
      'Learning difficulty prediction',
      'Automated curriculum suggestions'
    ]
  },
  {
    id: 'healthsync',
    name: 'HealthSync Pro',
    tagline: 'Complete Healthcare Management Ecosystem',
    description: 'Comprehensive healthcare system managing all aspects of medical facilities, patient care, and health records',
    icon: Heart,
    color: 'from-green-500 to-teal-600',
    launchDate: 'Q3 2026',
    status: 'Beta Testing',
    features: [
      'Patient management & records',
      'Appointment scheduling system',
      'Inventory & pharmacy management',
      'Staff & doctor scheduling',
      'Billing & insurance processing',
      'Telemedicine integration'
    ],
    aiFeatures: [
      'Symptom analysis & diagnosis support',
      'Drug interaction warnings',
      'Treatment recommendation engine',
      'Health trend predictions'
    ]
  }
]

export function UpcomingProducts() {
  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-14 sm:mb-16"
        >
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
            COMING SOON
          </div>

          <h2 className="mx-auto max-w-4xl text-balance text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Upcoming <span className="gradient-text">Products</span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-[1.85] text-muted-foreground sm:text-lg">
            Revolutionary AI-powered solutions launching in 2026
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {upcomingProducts.map((product, index) => {
            const IconComponent = product.icon
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <Card className="h-full overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  {/* Header */}
                  <div className={`h-28 sm:h-32 bg-gradient-to-r ${product.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                        {product.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 flex items-center text-white">
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
                      <div>
                        <h3 className="text-lg sm:text-2xl font-bold">{product.name}</h3>
                        <p className="text-white/90 text-xs sm:text-sm">{product.tagline}</p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Launch Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        Expected Launch: {product.launchDate}
                      </div>
                      <div className="flex items-center text-sm text-orange-600">
                        <Bell className="h-4 w-4 mr-1" />
                        Coming Soon
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6">{product.description}</p>

                    {/* Core Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Core Features
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {product.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-muted-foreground">
                            <Star className="h-3 w-3 text-blue-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-purple-600" />
                        AI Implementations
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {product.aiFeatures.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-muted-foreground">
                            <Zap className="h-3 w-3 text-purple-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        className="flex-1"
                        onClick={() => window.location.href = '/contact?product=' + product.id}
                      >
                        Get Early Access
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = '/products'}
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-primary to-secondary text-white border-0 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Be Among the First to Experience the Future
              </h3>
              <p className="text-white/90 mb-6 text-lg">
                Join our early access program and get exclusive previews, beta testing opportunities, and special launch pricing
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 font-semibold"
                  onClick={() => window.location.href = '/contact?interest=early-access'}
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Join Early Access Program
                </Button>
                <Button 
                  size="lg" 
                  variant="glass"
                  className="font-semibold"
                  onClick={() => window.location.href = '/products'}
                >
                  View All Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}