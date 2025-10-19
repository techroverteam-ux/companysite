'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Sparkles, Gift, Clock } from 'lucide-react'

interface DiwaliOffersProps {
  campaign: {
    offers: Array<{
      service: string
      originalPrice: string
      discountedPrice: string
      savings: string
    }>
    features: string[]
  }
}

export function DiwaliOffers({ campaign }: DiwaliOffersProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-200/30 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-200/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
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
            <Sparkles className="h-8 w-8 text-orange-500 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Diwali Special Pricing
            </h2>
            <Sparkles className="h-8 w-8 text-orange-500 ml-2" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Celebrate the festival of lights with amazing discounts on all our services
          </p>
          
          <div className="flex items-center justify-center mt-6 bg-red-100 text-red-800 px-4 py-2 rounded-full inline-flex">
            <Clock className="h-4 w-4 mr-2" />
            <span className="font-medium">Offer valid till November 5th, 2024</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {campaign.offers.map((offer, index) => (
            <motion.div
              key={offer.service}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <Card className="h-full border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{offer.service}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 line-through">
                      {offer.originalPrice}
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {offer.discountedPrice}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      Save {offer.savings}
                    </div>
                  </div>
                  <Button 
                    variant="gradient" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Claim Offer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bonus Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">🎁 Diwali Bonus Features</h3>
                <p className="text-white/90">Exclusive benefits with every service</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <span className="text-white/90">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-orange-600 hover:bg-white/90 font-semibold"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Your Diwali Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}