'use client'

import { motion } from 'framer-motion'
import { Sparkles, Heart, Star } from 'lucide-react'

export function DiwaliSocialBanner() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-8 w-16 h-16 bg-yellow-300/20 rounded-full animate-pulse" />
        <div className="absolute top-12 right-12 w-12 h-12 bg-orange-300/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-8 left-16 w-20 h-20 bg-red-300/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-16 right-8 w-14 h-14 bg-pink-300/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8 text-center text-white">
        {/* Diya Icons */}
        <div className="flex justify-center space-x-4 mb-6">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="text-yellow-300 text-2xl"
            >
              🪔
            </motion.div>
          ))}
        </div>

        {/* Shree Ram */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-yellow-200 mb-2">🙏 श्री राम 🙏</p>
        </div>

        {/* Main Greeting */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Happy Diwali! ✨
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl mb-6 text-orange-100"
        >
          May this Festival of Lights illuminate your path to success and prosperity
        </motion.p>

        {/* Decorative Elements */}
        <div className="flex justify-center items-center space-x-3 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </motion.div>
          <Heart className="h-5 w-5 text-red-200" />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Star className="h-6 w-6 text-yellow-300" />
          </motion.div>
        </div>

        {/* Company Branding */}
        <div className="border-t border-white/30 pt-6 mt-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Logo - Simple Navbar Style */}
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #004AAD 0%, #00C6AE 100%)'
                }}
              >
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-white">Techrover</span>
            </div>
            
            {/* Blessing Message */}
            <div className="text-center bg-white/15 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <p className="text-lg font-semibold text-white mb-1">
                Wishing you joy, prosperity & success
              </p>
              <p className="text-sm text-yellow-200 mb-3">
                May Lord Ram bless you with happiness and peace
              </p>
              
              {/* Contact Information */}
              <div className="border-t border-white/20 pt-3">
                <p className="text-white font-semibold text-sm mb-1">
                  📞 Contact: Akshay Neriya
                </p>
                <p className="text-yellow-200 font-bold text-sm mb-2">
                  +91 7014265848
                </p>
                <p className="text-white text-xs">
                  🌐 www.techrover.co.in
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hashtags for Social Media */}
        <div className="mt-6 text-sm text-orange-100">
          #HappyDiwali #FestivalOfLights #TechRover #Prosperity #Success
        </div>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300 text-lg"
            style={{
              left: `${20 + (i * 12)}%`,
              top: `${15 + (i * 10)}%`,
            }}
            animate={{
              y: [-5, -15, -5],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </div>
  )
}