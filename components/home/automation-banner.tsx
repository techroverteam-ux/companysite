'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Bot, Zap } from 'lucide-react'
import { useState } from 'react'

interface AutomationBannerProps {
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

export function AutomationBanner({ campaign }: AutomationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden"
      style={{ background: campaign.banner.backgroundColor }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <Bot className="hidden sm:block h-8 w-8 text-white flex-shrink-0" />
            
            <div className="min-w-0 text-left">
              <h2 className="text-sm sm:text-xl md:text-2xl font-bold text-white mb-0.5 sm:mb-1 truncate">
                {campaign.banner.title}
              </h2>
              <p className="text-white/90 text-xs sm:text-sm md:text-base truncate">
                {campaign.banner.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden sm:block text-center">
              <div className="text-lg md:text-2xl font-bold text-white">
                {campaign.banner.discount}
              </div>
              <div className="text-white/90 text-xs md:text-sm">
                ON
              </div>
            </div>

            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white text-purple-600 hover:bg-white/90 font-semibold text-xs sm:text-sm"
              onClick={() => window.location.href = '/ai-agents'}
            >
              <Zap className="mr-2 h-4 w-4" />
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