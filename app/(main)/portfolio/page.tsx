'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Star, MapPin } from 'lucide-react'
import portfolioDataRaw from '@/data/portfolio.json'
import portfolioSimple from '@/data/portfolio-simple.json'
import { decrypt } from '@/lib/auth'

export default function PortfolioPage() {
  // Use simple portfolio data for case study links
  let portfolioData = portfolioSimple
  
  // Try to decrypt original data if available
  try {
    if (portfolioDataRaw.data && typeof portfolioDataRaw.data === 'string') {
      const decrypted = decrypt(portfolioDataRaw.data)
      if (decrypted && Array.isArray(decrypted)) {
        portfolioData = decrypted
      }
    }
  } catch (error) {
    console.log('Using simple portfolio data')
  }

  return (
    <div className="pt-16">
      <section className="bg-muted/50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              OUR WORK
            </div>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
              Our <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="mx-auto mt-5 max-w-4xl text-base leading-[1.85] text-muted-foreground sm:text-lg md:text-xl">
              Showcasing successful projects that have transformed businesses worldwide
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {Array.isArray(portfolioData) && portfolioData.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-r from-primary to-secondary rounded-t-lg flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold text-center px-4">
                      {project.title}
                    </h3>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
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
                    <CardDescription className="text-muted-foreground mb-4">
                      {project.description}
                    </CardDescription>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(project.technologies) && project.technologies.map((tech: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-muted text-foreground/80 rounded text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{project.review}"</p>
                      <p className="text-sm font-medium mt-2">- {project.clientName}</p>
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground mb-4">
                      <span>Duration: {project.projectDuration}</span>
                      <span>Team: {project.teamSize}</span>
                    </div>

                    <Button variant="gradient" className="w-full" onClick={() => window.location.href = `/case-study/${project.id}`}>
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