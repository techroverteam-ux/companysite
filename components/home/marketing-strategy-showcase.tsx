'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Zap, 
  Target, 
  TrendingUp, 
  ArrowRight,
  Brain,
  Rocket,
  Globe,
  Leaf,
  Shield,
  Eye,
  Users
} from 'lucide-react'

const strategies = [
  {
    icon: Zap,
    title: "Quantum-First Marketing",
    description: "Leading the quantum computing revolution",
    features: ["Quantum-ready solutions", "Future-proof architecture", "Advanced encryption"],
  },
  {
    icon: Brain,
    title: "AI-Powered Personalization",
    description: "Hyper-personalized customer experiences",
    features: ["Dynamic content", "Predictive analytics", "Smart recommendations"],
  },
  {
    icon: Globe,
    title: "Metaverse Presence",
    description: "Virtual world business solutions",
    features: ["Virtual offices", "AR/VR demos", "Immersive experiences"],
  },
  {
    icon: Leaf,
    title: "Sustainability Leadership",
    description: "Eco-friendly technology solutions",
    features: ["Carbon-neutral hosting", "Green computing", "Environmental impact"],
  }
]

const innovations = [
  { icon: Eye, title: "Holographic Consultations", desc: "3D meetings with AR technology" },
  { icon: Shield, title: "Quantum Encryption", desc: "Unbreakable security protocols" },
  { icon: Users, title: "Biometric Dashboards", desc: "Adaptive user interfaces" },
  { icon: Rocket, title: "Voice-First Interfaces", desc: "Natural language controls" }
]

export function MarketingStrategyShowcase() {
  const sectionEase = [0.22, 1, 0.36, 1] as const

  return (
    <section className="relative overflow-hidden bg-muted/50 py-14 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-48 w-48 sm:h-72 sm:w-72 lg:h-96 lg:w-96 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-48 w-48 sm:h-64 sm:w-64 lg:h-80 lg:w-80 rounded-full bg-secondary/[0.05] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: sectionEase }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-10 text-center sm:mb-12"
        >
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
            2026 STRATEGY
          </div>

          <h2 className="mx-auto max-w-4xl text-balance text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Marketing <span className="gradient-text">Revolution</span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-[1.85] text-muted-foreground sm:text-lg">
            Revolutionary strategies powered by quantum computing, AI personalization, and sustainable innovation
          </p>
        </motion.div>

        {/* Strategy Cards */}
        <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {strategies.map((strategy, index) => {
            const IconComponent = strategy.icon

            return (
              <motion.div
                key={strategy.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: sectionEase }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card className="group h-full border-border/70 bg-card/80 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/20 transition-transform duration-300 group-hover:scale-110">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {strategy.title}
                    </h3>
                    <p className="mb-4 text-sm leading-[1.75] text-muted-foreground">{strategy.description}</p>

                    <div className="space-y-2">
                      {strategy.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
                        >
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Innovation Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: sectionEase }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-14"
        >
          <h3 className="mb-8 text-center text-2xl font-bold tracking-[-0.02em]">
            Revolutionary <span className="gradient-text">Innovations</span>
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
            {innovations.map((innovation, index) => {
              const IconComponent = innovation.icon

              return (
                <motion.div
                  key={innovation.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.08, ease: sectionEase }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="group rounded-xl border border-border/80 bg-card/70 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-secondary/20 transition-transform duration-300 group-hover:scale-110">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="mb-1 text-sm font-semibold text-foreground">{innovation.title}</h4>
                  <p className="text-xs leading-[1.7] text-muted-foreground">{innovation.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: sectionEase }}
          viewport={{ once: true, margin: "-100px" }}
          className="rounded-2xl border border-border/80 bg-card/70 p-8 text-center backdrop-blur sm:p-10"
        >
          <h3 className="mb-3 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
            Ready to Experience the <span className="gradient-text">Future</span>?
          </h3>
          <p className="mx-auto mb-7 max-w-2xl text-base leading-[1.85] text-muted-foreground">
            Join the revolution with cutting-edge marketing strategies and innovative solutions
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="gradient"
              className="h-12 px-8 font-semibold sm:h-14"
              onClick={() => window.location.href = '/new-year-2026'}
            >
              <Target className="mr-2 h-5 w-5" />
              Explore 2026 Strategy
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 font-semibold sm:h-14"
              onClick={() => window.location.href = '/contact?strategy=2026'}
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Get Strategic Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}