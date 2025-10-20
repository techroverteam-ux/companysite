'use client'

import { DiwaliSocialBanner } from '@/components/social/diwali-social-banner'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useRef } from 'react'
import html2canvas from 'html2canvas'

export default function DiwaliBannerPage() {
  const bannerRef = useRef<HTMLDivElement>(null)

  const downloadBanner = async () => {
    if (bannerRef.current) {
      const canvas = await html2canvas(bannerRef.current, {
        backgroundColor: '#f97316',
        scale: 3,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: bannerRef.current.offsetWidth,
        height: bannerRef.current.offsetHeight
      })
      
      const link = document.createElement('a')
      link.download = 'techrover-diwali-banner.png'
      link.href = canvas.toDataURL('image/png', 1.0)
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Diwali Social Media Banner</h1>
        <p className="text-center text-gray-600 mb-12">
          Download and share this banner on LinkedIn, Twitter, and WhatsApp
        </p>
        
        <div className="flex justify-center mb-8">
          <div ref={bannerRef}>
            <DiwaliSocialBanner />
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            onClick={downloadBanner}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Banner
          </Button>
        </div>
      </div>
    </div>
  )
}