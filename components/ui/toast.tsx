'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning'
  message: string
}

let toastQueue: Toast[] = []
let setToasts: ((toasts: Toast[]) => void) | null = null

export const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
  const toast: Toast = {
    id: Date.now().toString(),
    type,
    message
  }
  
  toastQueue = [...toastQueue, toast]
  if (setToasts) {
    setToasts([...toastQueue])
  }
  
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== toast.id)
    if (setToasts) {
      setToasts([...toastQueue])
    }
  }, 4000)
}

export function ToastContainer() {
  const [toasts, setToastsState] = useState<Toast[]>([])
  
  useEffect(() => {
    setToasts = setToastsState
    setToastsState([...toastQueue])
  }, [])

  const removeToast = (id: string) => {
    toastQueue = toastQueue.filter(t => t.id !== id)
    setToastsState([...toastQueue])
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className={`
              flex items-center gap-3 p-4 rounded-lg shadow-lg min-w-80 max-w-md
              ${toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : ''}
              ${toast.type === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' : ''}
              ${toast.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' : ''}
            `}
          >
            {toast.type === 'success' && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
            {toast.type === 'error' && <XCircle className="h-5 w-5 flex-shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
            
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}