'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function FloatingElements() {
  const [particles, setParticles] = useState<Array<{x: number, y: number, duration: number, delay: number, xMove: number}>>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setParticles(
      Array.from({ length: 20 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
        xMove: Math.random() * 100 - 50
      }))
    )
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating Shapes */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
      />
      
      <motion.div
        animate={{ 
          y: [0, 40, 0],
          x: [0, -25, 0],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 right-1/3 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg opacity-15"
      />
      
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          x: [0, 15, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-gradient-to-r from-green-400 to-teal-500 rounded-full opacity-25"
      />
      
      <motion.div
        animate={{ 
          y: [0, 35, 0],
          x: [0, -30, 0],
          rotate: [0, -180, -360]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-gradient-to-r from-pink-400 to-red-500 rounded-lg opacity-20"
      />

      {/* Particle Effects */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            x: [0, particle.xMove, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
        />
      ))}
    </div>
  )
}