'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Bot, Zap, Clock } from 'lucide-react'

interface AutomationSectionProps {
  campaign: {
    automationServices: Array<{
      title: string
      description: string
      benefit: string
    }>
    features: string[]
  }
}

export function AutomationSection({ campaign }: AutomationSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Bot className="h-8 w-8 text-purple-500 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Automation While You Celebrate
            </h2>
            <Bot className="h-8 w-8 text-purple-500 ml-2" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enjoy your post-Diwali festivities while our AI agents keep your business running smoothly
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {campaign.automationServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <Card className="h-full border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </div>
                  <p className="text-gray-600">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-green-700 font-medium text-sm">{service.benefit}</span>
                    </div>
                  </div>
                  <Button 
                    variant="gradient" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.location.href = '/ai-agents'}
                  >
                    Setup Agent
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">🤖 Complete Automation Package</h3>
                <p className="text-white/90">Everything you need for worry-free celebrations</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {campaign.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    className="flex items-center"
                  >
                    <CheckCircle className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span className="text-white/90 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                  onClick={() => window.location.href = '/ai-agents'}
                >
                  <Clock className="mr-2 h-5 w-5" />
                  Activate Full Automation
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}