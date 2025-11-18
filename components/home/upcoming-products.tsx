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
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-yellow-500 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Upcoming <span className="gradient-text">Products</span>
            </h2>
            <Zap className="h-8 w-8 text-yellow-500 ml-2" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionary AI-powered solutions launching in 2026
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {upcomingProducts.map((product, index) => {
            const IconComponent = product.icon
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <Card className="h-full overflow-hidden border-2 border-gray-200 hover:border-primary/50 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  {/* Header */}
                  <div className={`h-32 bg-gradient-to-r ${product.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                        {product.status}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-6 flex items-center text-white">
                      <IconComponent className="h-8 w-8 mr-3" />
                      <div>
                        <h3 className="text-2xl font-bold">{product.name}</h3>
                        <p className="text-white/90 text-sm">{product.tagline}</p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Launch Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Expected Launch: {product.launchDate}
                      </div>
                      <div className="flex items-center text-sm text-orange-600">
                        <Bell className="h-4 w-4 mr-1" />
                        Coming Soon
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6">{product.description}</p>

                    {/* Core Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Core Features
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {product.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <Star className="h-3 w-3 text-blue-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-purple-600" />
                        AI Implementations
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {product.aiFeatures.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <Zap className="h-3 w-3 text-purple-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex gap-3">
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
          viewport={{ once: true }}
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
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary font-semibold"
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