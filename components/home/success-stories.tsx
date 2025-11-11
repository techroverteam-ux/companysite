'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Star, Globe, Smartphone, Building2 } from 'lucide-react'

interface SuccessStory {
  id: string
  title: string
  company: string
  website: string
  industry: string
  description: string
  services: string[]
  platforms: string[]
  icon: 'globe' | 'smartphone' | 'building'
}

const successStories: SuccessStory[] = [
  {
    id: '1',
    title: 'GBS Portal Development',
    company: 'GBS Organization',
    website: 'https://www.gbs.org.in/',
    industry: 'Educational Services',
    description: 'Comprehensive web portal with mobile applications for both Android and iOS platforms, serving educational and organizational needs.',
    services: ['Web Development', 'Mobile App Development', 'UI/UX Design'],
    platforms: ['Web Portal', 'Android App', 'iOS App'],
    icon: 'globe'
  },
  {
    id: '2',
    title: 'Stone Processing Machine Sales Platform',
    company: 'Radhika Machine Tools',
    website: 'https://radhikamachinetools.com/',
    industry: 'Industrial Manufacturing',
    description: 'E-commerce platform for stone processing machinery with multi-branch management system covering 3 locations.',
    services: ['E-commerce Development', 'Multi-branch Management', 'Inventory System'],
    platforms: ['Web Platform', 'Admin Dashboard', 'Branch Management'],
    icon: 'building'
  },
  {
    id: '3',
    title: 'Hospital Management System',
    company: 'Varaha SDC',
    website: 'https://app.varahasdc.co.in/',
    industry: 'Healthcare',
    description: 'Complete hospital management system for VDC with patient management, appointment scheduling, and medical records.',
    services: ['Healthcare Software', 'Patient Management', 'Medical Records'],
    platforms: ['Web Application', 'Admin Panel', 'Patient Portal'],
    icon: 'smartphone'
  }
]

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'globe':
      return Globe
    case 'smartphone':
      return Smartphone
    case 'building':
      return Building2
    default:
      return Globe
  }
}

export function SuccessStories() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how we've helped businesses across industries achieve their digital transformation goals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successStories.map((story, index) => {
            const IconComponent = getIcon(story.icon)
            
            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="h-full overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="h-48 bg-gradient-to-br from-primary via-purple-500 to-secondary relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    <motion.div
                      className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center cursor-pointer"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      onClick={() => window.open(story.website, '_blank')}
                    >
                      <ExternalLink className="h-5 w-5 text-white" />
                    </motion.div>
                    
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {story.industry}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all duration-300">
                      {story.title}
                    </h3>
                    <p className="text-primary font-medium mb-2">{story.company}</p>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {story.description}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Services Provided:</h4>
                      <div className="flex flex-wrap gap-2">
                        {story.services.map((service, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * idx }}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                          >
                            {service}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Platforms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {story.platforms.map((platform, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
                        onClick={() => window.open(story.website, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Website
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-600 mb-6">
            Ready to become our next success story?
          </p>
          <Button 
            size="lg" 
            variant="gradient" 
            onClick={() => window.location.href = '/contact'}
          >
            Start Your Project
          </Button>
        </motion.div>
      </div>
    </section>
  )
}