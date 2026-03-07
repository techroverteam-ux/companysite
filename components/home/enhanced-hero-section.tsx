'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react'
import { useRef } from 'react'

interface HeroData {
  headline: string
  tagline: string
  ctaText: string
  backgroundVideo?: string
}

interface EnhancedHeroSectionProps {
  data: HeroData
}

export function EnhancedHeroSection({ data }: EnhancedHeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const primaryCta = (
    <Button
      size="lg"
      variant="gradient"
      className="font-bold px-8 py-4 text-lg shadow-2xl"
      onClick={() => window.location.href = '/new-year-2026'}
    >
      <Target className="mr-2 h-5 w-5" />
      {data.ctaText}
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  )

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#02224f] via-[#004AAD] to-[#00A892]"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00C6AE]/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#004AAD]/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -80, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#00C6AE]/12 rounded-full blur-2xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-r from-[#004AAD] to-[#00C6AE] rounded-lg opacity-25"
      />
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-32 right-32 w-12 h-12 bg-gradient-to-r from-[#00C6AE] to-[#004AAD] rounded-full opacity-35"
      />

      <motion.div 
        style={{ y, opacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-secondary mr-2" />
            </motion.div>
            <span className="text-white text-sm font-medium">Revolutionary 2026 Solutions</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="h-4 w-4 text-secondary ml-2" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {data.headline.split(' ').map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className={index === 1 ? "bg-gradient-to-r from-secondary to-white bg-clip-text text-transparent" : ""}
              >
                {word}{' '}
              </motion.span>
            ))}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-gray-100 max-w-3xl mx-auto mb-12"
          >
            {data.tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            {primaryCta}
            
            <Button 
              size="lg" 
              variant="glass"
              className="font-semibold px-8 py-4 text-lg"
              onClick={() => window.location.href = '/portfolio'}
            >
              View Our Work
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}