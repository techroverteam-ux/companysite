'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  isVisible: boolean
  onClose: () => void
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`
            flex items-center p-4 rounded-xl shadow-2xl border-2 min-w-[350px] backdrop-blur-sm
            ${type === 'success' 
              ? 'gradient-bg text-white border-white/20' 
              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-white/20'
            }
          `}>
            {type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-3 text-white" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-3 text-white" />
            )}
            
            <div className="flex-1">
              <p className="font-medium text-white">{message}</p>
            </div>
            
            <button
              onClick={onClose}
              className="ml-3 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}