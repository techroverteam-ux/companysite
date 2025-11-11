'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Rocket, 
  Zap, 
  Target, 
  Gift, 
  Calendar, 
  TrendingUp, 
  Sparkles,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react'

interface NewYear2026CampaignProps {
  campaign: {
    title: string
    subtitle: string
    offers: Array<{
      title: string
      description: string
      originalPrice: string
      newYearPrice: string
      savings: string
      features: string[]
      badge: string
    }>
    uniqueFeatures: Array<{
      icon: string
      title: string
      description: string
    }>
    countdown: {
      endDate: string
    }
  }
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'rocket': return Rocket
    case 'zap': return Zap
    case 'target': return Target
    case 'trending': return TrendingUp
    default: return Sparkles
  }
}

export function NewYear2026Campaign({ campaign }: NewYear2026CampaignProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-blue-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-yellow-400 mr-3 animate-spin" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              {campaign.title}
            </h2>
            <Sparkles className="h-8 w-8 text-yellow-400 ml-3 animate-spin" />
          </div>
          
          <p className="text-xl text-gray-200 max-w-4xl mx-auto mb-8">
            {campaign.subtitle}
          </p>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 inline-flex">
            <Clock className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="text-white font-semibold">Limited Time: Ends {campaign.countdown.endDate}</span>
          </div>
        </motion.div>

        {/* Unique 2026 Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            🚀 Revolutionary 2026 Innovations
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaign.uniqueFeatures.map((feature, index) => {
              const IconComponent = getIcon(feature.icon)
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                      <p className="text-gray-200 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* New Year Offers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {campaign.offers.map((offer, index) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 30, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <Card className="h-full bg-white/95 backdrop-blur-sm border-2 border-yellow-400/50 hover:border-yellow-400 transition-all duration-300 relative overflow-hidden">
                {/* Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold transform rotate-12">
                  {offer.badge}
                </div>

                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">{offer.title}</CardTitle>
                  <p className="text-gray-600 text-sm">{offer.description}</p>
                </CardHeader>

                <CardContent className="text-center">
                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="text-lg text-gray-500 line-through mb-1">
                      {offer.originalPrice}
                    </div>
                    <div className="text-3xl font-bold text-indigo-600 mb-1">
                      {offer.newYearPrice}
                    </div>
                    <div className="text-green-600 font-semibold">
                      Save {offer.savings}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6 text-left">
                    <h4 className="font-semibold text-gray-800 mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {offer.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3"
                    onClick={() => window.location.href = '/contact?campaign=newyear2026'}
                  >
                    Claim 2026 Offer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">
                🎊 Ready to Transform Your Business in 2026?
              </h3>
              <p className="text-xl mb-6 text-white/90">
                Join the digital revolution with cutting-edge technology solutions designed for the future
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-4"
                  onClick={() => window.location.href = '/contact?campaign=newyear2026'}
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Your 2026 Journey
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-600 font-bold px-8 py-4"
                  onClick={() => window.location.href = '/schedule'}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Free Consultation
                </Button>
              </div>

              <div className="mt-6 text-white/80">
                <p className="text-sm">
                  ⚡ Limited slots available | 🎯 Exclusive 2026 pricing | 🚀 Future-ready solutions
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}