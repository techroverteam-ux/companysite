'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Brain,
  Rocket,
  Globe,
  Leaf,
  Shield,
  Eye,
  Users
} from 'lucide-react'
import { useRef } from 'react'

const strategies = [
  {
    icon: Zap,
    title: "Quantum-First Marketing",
    description: "Leading the quantum computing revolution",
    color: "from-blue-500 to-cyan-500",
    features: ["Quantum-ready solutions", "Future-proof architecture", "Advanced encryption"],
    gradient: "bg-gradient-to-br from-blue-50 to-cyan-50"
  },
  {
    icon: Brain,
    title: "AI-Powered Personalization",
    description: "Hyper-personalized customer experiences",
    color: "from-purple-500 to-pink-500",
    features: ["Dynamic content", "Predictive analytics", "Smart recommendations"],
    gradient: "bg-gradient-to-br from-purple-50 to-pink-50"
  },
  {
    icon: Globe,
    title: "Metaverse Presence",
    description: "Virtual world business solutions",
    color: "from-indigo-500 to-purple-500",
    features: ["Virtual offices", "AR/VR demos", "Immersive experiences"],
    gradient: "bg-gradient-to-br from-indigo-50 to-purple-50"
  },
  {
    icon: Leaf,
    title: "Sustainability Leadership",
    description: "Eco-friendly technology solutions",
    color: "from-green-500 to-emerald-500",
    features: ["Carbon-neutral hosting", "Green computing", "Environmental impact"],
    gradient: "bg-gradient-to-br from-green-50 to-emerald-50"
  }
]

const innovations = [
  { icon: Eye, title: "Holographic Consultations", desc: "3D meetings with AR technology" },
  { icon: Shield, title: "Quantum Encryption", desc: "Unbreakable security protocols" },
  { icon: Users, title: "Biometric Dashboards", desc: "Adaptive user interfaces" },
  { icon: Rocket, title: "Voice-First Interfaces", desc: "Natural language controls" }
]

export function MarketingStrategyShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section ref={containerRef} className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          style={{ y, opacity }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="flex items-center justify-center mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-12 w-12 text-yellow-400 mr-4" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              2026 Marketing
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Revolution</span>
            </h2>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-12 w-12 text-yellow-400 ml-4" />
            </motion.div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-4xl mx-auto"
          >
            Revolutionary strategies powered by quantum computing, AI personalization, and sustainable innovation
          </motion.p>
        </motion.div>

        {/* Strategy Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {strategies.map((strategy, index) => {
            const IconComponent = strategy.icon
            
            return (
              <motion.div
                key={strategy.title}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
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
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <Card className="h-full bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-500 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${strategy.color}`} />
                  
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 bg-gradient-to-r ${strategy.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-2xl`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                      {strategy.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">{strategy.description}</p>
                    
                    <div className="space-y-2">
                      {strategy.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex items-center text-xs text-gray-400"
                        >
                          <div className={`w-2 h-2 bg-gradient-to-r ${strategy.color} rounded-full mr-2`} />
                          {feature}
                        </motion.div>
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
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            🚀 Revolutionary <span className="text-yellow-400">Innovations</span>
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {innovations.map((innovation, index) => {
              const IconComponent = innovation.icon
              
              return (
                <motion.div
                  key={innovation.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                  }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4"
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </motion.div>
                  <h4 className="text-white font-semibold mb-2">{innovation.title}</h4>
                  <p className="text-gray-400 text-sm">{innovation.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 border-0 overflow-hidden relative">
            <motion.div
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
            
            <CardContent className="p-8 text-center relative z-10">
              <motion.h3
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-white mb-4"
              >
                Ready to Experience the Future?
              </motion.h3>
              <p className="text-white/90 text-lg mb-6">
                Join the revolution with cutting-edge marketing strategies and innovative solutions
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-4 shadow-2xl"
                    onClick={() => window.location.href = '/new-year-2026'}
                  >
                    <Target className="mr-2 h-5 w-5" />
                    Explore 2026 Strategy
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-orange-600 font-bold px-8 py-4"
                    onClick={() => window.location.href = '/contact?strategy=2026'}
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Get Strategic Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}