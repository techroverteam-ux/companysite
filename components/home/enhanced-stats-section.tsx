'use client'

import { motion, useInView } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
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
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Impact</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Numbers that showcase our commitment to excellence and innovation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = icons[index % icons.length]
            const numericValue = parseInt(stat.number.replace(/[^\d]/g, ''))
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="h-full bg-white/10 backdrop-blur-xl border border-white/20 hover:border-yellow-400/50 transition-all duration-500 group">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl"
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </motion.div>
                    
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-4xl md:text-5xl font-bold text-white mb-2"
                    >
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
                    </motion.div>
                    
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-gray-300 font-medium group-hover:text-yellow-400 transition-colors"
                    >
                      {stat.label}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "🏆 Industry Leader",
              "🚀 Innovation Award",
              "⭐ 5-Star Rated",
              "🌟 Client Favorite"
            ].map((badge, index) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white font-medium hover:border-yellow-400/50 transition-all duration-300"
              >
                {badge}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}