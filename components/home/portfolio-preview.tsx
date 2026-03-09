'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  industry: string
  description: string
  technologies: string[]
  clientCountry: string
  review: string
  clientName: string
  logo?: string
}

interface PortfolioPreviewProps {
  projects: Project[]
}

// Helper function to get logo based on project title
const getProjectLogo = (title: string): string => {
  const titleLower = title.toLowerCase()
  if (titleLower.includes('gbs') || titleLower.includes('portal')) {
    return '/logos/gbs-logo.png'
  }
  if (titleLower.includes('radhika') || titleLower.includes('machine') || titleLower.includes('stone')) {
    return '/logos/radhika-logo.png'
  }
  if (titleLower.includes('varaha') || titleLower.includes('hospital') || titleLower.includes('sdc')) {
    return '/logos/varaha-sdc-logo.svg'
  }
  return '/logos/generic-project-logo.svg'
}

export function PortfolioPreview({ projects }: PortfolioPreviewProps) {
  const featuredProjects = Array.isArray(projects) ? projects.slice(0, 3) : []

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
            OUR WORK
          </div>

          <h2 className="mx-auto max-w-4xl text-balance text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Featured <span className="gradient-text">Projects</span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-[1.85] text-muted-foreground sm:text-lg">
            Discover how we&apos;ve helped businesses transform through innovative technology solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <Card className="h-full overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm">
                <div className="h-48 bg-gradient-to-br from-primary via-[#0f65cf] to-secondary relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  <motion.div
                    className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ExternalLink className="h-5 w-5 text-white" />
                  </motion.div>
                  
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 h-20 bg-white/90 rounded-full backdrop-blur-sm flex items-center justify-center p-3">
                      <img
                        src={getProjectLogo(project.title)}
                        alt={`${project.title} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {project.industry}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * idx }}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-muted-foreground">{project.clientCountry}</span>
                    </div>
                    <p className="text-sm text-muted-foreground italic line-clamp-2">
                      "{project.review}"
                    </p>
                    <p className="text-sm font-medium mt-1">- {project.clientName}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mt-12"
        >
          <Link href="/portfolio">
            <Button size="lg" variant="gradient" className="group">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}