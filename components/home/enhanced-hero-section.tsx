'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react'
import { useRef } from 'react'
import Link from 'next/link'

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

  const smoothEase = [0.22, 1, 0.36, 1] as const
  const ambientTransition = {
    repeat: Infinity,
    repeatType: 'mirror' as const,
    ease: 'easeInOut' as const,
  }
  const introTransition = { duration: 1.15, ease: smoothEase }
  const headlineWords = data.headline.split(' ')
  const headlineVariants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: 0.26,
        staggerChildren: 0.075,
      },
    },
  }
  const wordVariants = {
    hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.72, ease: smoothEase },
    },
  }

  const y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const primaryCta = (
    <Button
      asChild
      size="lg"
      variant="gradient"
      className="h-12 px-8 text-base font-semibold shadow-xl sm:h-14 sm:text-lg"
    >
      <Link href="/new-year-2026">
        <Target className="mr-2 h-5 w-5" />
        {data.ctaText}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
    </Button>
  )

  return (
    <motion.section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#02224f] via-[#004AAD] to-[#00A892]"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={introTransition}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1] bg-[#031a40]"
        initial={{ opacity: 0.45 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: smoothEase }}
      />

      {/* Animated Background */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.55, scale: 1.12 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.35, ease: smoothEase }}
      >
        <motion.div 
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#00C6AE]/16 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, ...ambientTransition }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#004AAD]/24 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -80, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 15, ...ambientTransition }}
        />
        <motion.div 
          className="absolute left-1/2 top-1/2 h-64 w-64 rounded-full bg-[#00C6AE]/10 blur-2xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 7, ...ambientTransition }}
        className="absolute left-20 top-20 hidden h-16 w-16 rounded-2xl bg-gradient-to-br from-white/8 to-white/0 lg:block"
      />
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 9, ...ambientTransition }}
        className="absolute bottom-32 right-32 hidden h-12 w-12 rounded-full bg-gradient-to-br from-white/14 to-white/0 lg:block"
      />

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 mx-auto max-w-7xl px-5 text-center sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, delay: 0.16, ease: smoothEase }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.22, ease: smoothEase }}
          className="relative px-2 py-16 sm:px-6 sm:py-20 md:px-10 lg:py-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: smoothEase }}
            className="relative z-10 mb-10 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-5 py-2 sm:px-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-secondary mr-2" />
            </motion.div>
            <span className="text-xs font-medium tracking-[0.08em] text-white sm:text-sm">Revolutionary 2026 Solutions</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2.4, ...ambientTransition }}
            >
              <Zap className="h-4 w-4 text-secondary ml-2" />
            </motion.div>
          </motion.div>

          <motion.h1
            variants={headlineVariants}
            initial="hidden"
            animate="show"
            className="relative z-10 mb-8 text-balance text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {headlineWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                variants={wordVariants}
                className={index === 1 ? 'bg-gradient-to-r from-secondary to-white bg-clip-text text-transparent' : ''}
              >
                {word}{' '}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: smoothEase }}
            className="relative z-10 mx-auto mb-14 max-w-2xl text-base leading-[1.9] tracking-[0.012em] text-gray-100 sm:text-lg"
          >
            {data.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.56, ease: smoothEase }}
            className="relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
          >
            {primaryCta}

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/50 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white sm:h-14 sm:text-lg"
            >
              <Link href="/portfolio">View Our Work</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 transform md:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-7 h-11 border border-white/40 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3.5 bg-white/70 rounded-full mt-2"
            />
          </motion.div>
        </motion.div> */}
      </motion.div>
    </motion.section>
  )
}