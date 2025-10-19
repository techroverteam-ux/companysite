'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Sparkles, Gift } from 'lucide-react'
import { useState } from 'react'

interface MarketingBannerProps {
  campaign: {
    banner: {
      title: string
      subtitle: string
      discount: string
      description: string
      ctaText: string
      backgroundColor: string
      textColor: string
    }
  }
}

export function MarketingBanner({ campaign }: MarketingBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`relative overflow-hidden bg-gradient-to-r ${campaign.banner.backgroundColor}`}
    >
      <div className="absolute inset-0">
        <div className="absolute top-4 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-6 right-16 w-16 h-16 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-8 right-32 w-12 h-12 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <div className="text-lg font-bold text-white">
                {campaign.banner.discount}
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="text-center mb-3">
            <h2 className="text-lg font-bold text-white mb-1">
              {campaign.banner.title}
            </h2>
            <p className="text-white/90 text-sm">
              {campaign.banner.subtitle}
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white text-orange-600 hover:bg-white/90 font-semibold w-full max-w-xs"
              onClick={() => window.location.href = '/contact'}
            >
              <Gift className="mr-2 h-4 w-4" />
              {campaign.banner.ctaText}
            </Button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            
            <div className="text-left">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                {campaign.banner.title}
              </h2>
              <p className="text-white/90 text-sm md:text-base">
                {campaign.banner.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-white">
                {campaign.banner.discount}
              </div>
              <div className="text-white/90 text-xs md:text-sm">
                Limited Time
              </div>
            </div>

            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-orange-600 hover:bg-white/90 font-semibold"
              onClick={() => window.location.href = '/contact'}
            >
              <Gift className="mr-2 h-4 w-4" />
              {campaign.banner.ctaText}
            </Button>

            <button
              onClick={() => setIsVisible(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}