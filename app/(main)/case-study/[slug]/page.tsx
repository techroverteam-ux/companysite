'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Users, MapPin, CheckCircle, Quote } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import caseStudiesData from '@/data/case-studies.json'

interface CaseStudyPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = use(params)
  const caseStudy = caseStudiesData.find(study => study.slug === slug)

  if (!caseStudy) {
    notFound()
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/portfolio" className="inline-flex items-center text-white/80 hover:text-white mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{caseStudy.title}</h1>
                <p className="text-xl text-white/90 mb-8">{caseStudy.overview}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <span className="font-medium">Value: {caseStudy.projectValue}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{caseStudy.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{caseStudy.teamSize}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{caseStudy.country}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Project Highlights</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Client:</span>
                    <span className="font-medium">{caseStudy.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Industry:</span>
                    <span className="font-medium">{caseStudy.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium">{new Date(caseStudy.completedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Project <span className="gradient-text">Results</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {caseStudy.results.map((result, index) => (
              <motion.div
                key={result.metric}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold gradient-text mb-2">{result.value}</div>
                    <h3 className="font-semibold mb-2">{result.metric}</h3>
                    <p className="text-sm text-gray-600">{result.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-8 text-center">
                <Quote className="h-12 w-12 text-primary mx-auto mb-6" />
                <blockquote className="text-xl text-gray-700 mb-6 italic">
                  "{caseStudy.testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-lg">{caseStudy.testimonial.author}</div>
                  <div className="text-gray-600">{caseStudy.testimonial.position}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
            <p className="text-xl mb-8">Let's discuss how we can help transform your business</p>
            <Button size="lg" variant="secondary" onClick={() => window.location.href = '/contact'}>
              Start Your Project
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}