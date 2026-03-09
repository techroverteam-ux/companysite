'use client'

import { motion, useInView } from 'framer-motion'
import { TrendingUp, Users, Globe, Award } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

interface Stat {
  number: string
  label: string
}

interface EnhancedStatsSectionProps {
  stats: Stat[]
}

const icons = [TrendingUp, Users, Globe, Award]

function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref)

  useEffect(() => {
    if (isInView) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration])

  return <span ref={ref}>{count}</span>
}

export function EnhancedStatsSection({ stats }: EnhancedStatsSectionProps) {
  const sectionEase = [0.22, 1, 0.36, 1] as const

  return (
    <section className="relative overflow-hidden bg-background py-14 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-secondary/[0.05] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: sectionEase }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-10 text-center sm:mb-12"
        >
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
            OUR IMPACT
          </div>

          <h2 className="mx-auto max-w-4xl text-balance text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Numbers That Speak <span className="gradient-text">Excellence</span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-[1.85] text-muted-foreground sm:text-lg">
            Our commitment to innovation and quality reflected in every metric
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const IconComponent = icons[index % icons.length]
            const numericValue = parseInt(stat.number.replace(/[^\d]/g, ''))

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: sectionEase }}
                viewport={{ once: true, margin: "-100px" }}
                className="group rounded-xl border border-border/80 bg-card/70 px-5 py-7 text-center backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/20 transition-transform duration-300 group-hover:scale-110">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>

                <div className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {numericValue > 0 ? (
                    <>
                      <AnimatedCounter end={numericValue} />
                      {stat.number.includes('+') && '+'}
                      {stat.number.includes('K') && 'K'}
                      {stat.number.includes('%') && '%'}
                    </>
                  ) : (
                    stat.number
                  )}
                </div>

                <div className="mt-1.5 text-xs tracking-[0.06em] text-muted-foreground sm:text-sm">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Achievement Pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: sectionEase }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            "🏆 Industry Leader",
            "🚀 Innovation Award",
            "⭐ 5-Star Rated",
            "🌟 Client Favorite"
          ].map((badge) => (
            <div
              key={badge}
              className="rounded-full border border-border/80 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur transition-colors duration-200 hover:border-primary/40 hover:text-foreground"
            >
              {badge}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}