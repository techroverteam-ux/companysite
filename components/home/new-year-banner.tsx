'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Sparkles, ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface NewYearBannerProps {
  campaign: {
    title: string
    subtitle: string
    endDate: string
  }
}

export function NewYearBanner({ campaign }: NewYearBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
              <span className="font-bold text-sm sm:text-base">
                🎊 {campaign.title}
              </span>
              <span className="text-xs sm:text-sm text-purple-100">
                Limited time offer ends {campaign.endDate}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold text-xs sm:text-sm px-3 sm:px-4"
              onClick={() => window.location.href = '/new-year-2026'}
            >
              View Offers
              <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}