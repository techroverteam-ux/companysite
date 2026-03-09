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
      className="fixed left-0 right-0 top-0 z-[60] bg-gradient-to-r from-primary via-[#0f65cf] to-secondary text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 py-2.5 sm:py-3">
          <div className="flex min-w-0 items-center space-x-2 sm:space-x-3">
            <Sparkles className="h-5 w-5 text-secondary animate-pulse" />
            <div className="flex min-w-0 flex-col sm:flex-row sm:items-center sm:space-x-2">
              <span className="truncate font-bold text-sm sm:text-base">
                🎊 {campaign.title}
              </span>
              <span className="truncate text-xs text-white/80 sm:text-sm">
                Limited time offer ends {campaign.endDate}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              size="sm"
              variant="gradient"
              className="px-2.5 text-xs font-semibold sm:px-4 sm:text-sm"
              onClick={() => window.location.href = '/new-year-2026'}
            >
              <span className="hidden sm:inline">View Offers</span>
              <span className="sm:hidden">Offers</span>
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