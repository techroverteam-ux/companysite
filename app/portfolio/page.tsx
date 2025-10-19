'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Star, MapPin } from 'lucide-react'
import portfolioDataRaw from '@/data/portfolio.json'
import { decrypt } from '@/lib/auth'

export default function PortfolioPage() {
  // Decrypt portfolio data if encrypted
  const portfolioData = portfolioDataRaw.data && typeof portfolioDataRaw.data === 'string'
    ? decrypt(portfolioDataRaw.data) || []
    : portfolioDataRaw || []

  return (
    <div className="pt-16">
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Portfolio</h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto text-white/90">
              Showcasing successful projects that have transformed businesses worldwide
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {Array.isArray(portfolioData) && portfolioData.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-r from-primary to-secondary rounded-t-lg flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold text-center px-4">
                      {project.title}
                    </h3>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded mr-2">
                            {project.industry}
                          </span>
                          <MapPin className="h-4 w-4 mr-1" />
                          {project.clientCountry}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4">
                      {project.description}
                    </CardDescription>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(project.technologies) && project.technologies.map((tech: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"{project.review}"</p>
                      <p className="text-sm font-medium mt-2">- {project.clientName}</p>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>Duration: {project.projectDuration}</span>
                      <span>Team: {project.teamSize}</span>
                    </div>

                    <Button variant="gradient" className="w-full" onClick={() => alert('Case study details coming soon!')}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Case Study
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}