'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Target, Brain, Database, Code, TrendingUp, Palette } from 'lucide-react'
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

const highlights = [
  { icon: Brain, label: 'AI Solutions' },
  { icon: Database, label: 'ERP Systems' },
  { icon: Code, label: 'Web Development' },
  { icon: TrendingUp, label: 'Digital Marketing' },
  { icon: Palette, label: 'Branding' },
]

export function EnhancedHeroSection({ data }: EnhancedHeroSectionProps) {
  const sectionEase = [0.22, 1, 0.36, 1] as const

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
    hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.65, ease: sectionEase },
    },
  }

  return (
    <section className="relative overflow-hidden bg-muted/50 pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
      {/* Subtle decorative background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-48 w-48 sm:h-72 sm:w-72 lg:h-[28rem] lg:w-[28rem] rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 sm:h-72 sm:w-72 lg:h-96 lg:w-96 rounded-full bg-secondary/[0.05] blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-32 w-32 sm:h-48 sm:w-48 lg:h-64 lg:w-64 -translate-x-1/2 rounded-full bg-primary/[0.03] blur-2xl" />
      </div>



      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: sectionEase }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            GLOBAL TECHNOLOGY PARTNER
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={headlineVariants}
            initial="hidden"
            animate="show"
            className="mx-auto mb-7 max-w-5xl text-balance text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {headlineWords.map((word, index) => {
              const isHighlight = ['Transform', 'AI-Powered'].includes(word)
              return (
                <motion.span
                  key={`${word}-${index}`}
                  variants={wordVariants}
                  className={isHighlight ? 'gradient-text' : ''}
                >
                  {word}{' '}
                </motion.span>
              )
            })}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: sectionEase }}
            className="mx-auto mb-10 max-w-2xl text-base leading-[1.85] text-muted-foreground sm:text-lg"
          >
            {data.tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48, ease: sectionEase }}
            className="mb-14 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
          >
            <Button
              asChild
              size="lg"
              variant="gradient"
            >
              <Link href="/new-year-2026">
                <Target className="mr-2 h-5 w-5" />
                {data.ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
            >
              <Link href="/portfolio">View Our Work</Link>
            </Button>
          </motion.div>

          {/* Service Highlight Pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.58, ease: sectionEase }}
            className="mx-auto mb-12 flex max-w-3xl flex-wrap items-center justify-center gap-3"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.07, ease: sectionEase }}
                  className="flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-4 py-2 text-sm text-muted-foreground backdrop-blur transition-colors duration-200 hover:border-primary/40 hover:text-foreground"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {item.label}
                </motion.div>
              )
            })}
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.68, ease: sectionEase }}
            className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5"
          >
            {[
              { value: '500+', label: 'Projects Delivered' },
              { value: '50+', label: 'Global Clients' },
              { value: '5+', label: 'Years Experience' },
              { value: '99%', label: 'Client Satisfaction' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: sectionEase, delay: 0.72 + 0.08 * index }}
                className="rounded-xl border border-border/80 bg-card/70 px-4 py-4 text-center backdrop-blur"
              >
                <div className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs tracking-[0.06em] text-muted-foreground sm:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}