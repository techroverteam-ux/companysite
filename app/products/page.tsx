'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, CheckCircle, Globe, Code, Users, TrendingUp } from 'lucide-react'
import productsData from '@/data/products.json'

export default function ProductsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-green-100 text-green-800'
      case 'In Development': return 'bg-blue-100 text-blue-800'
      case 'Under Development': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="pt-16">
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{productsData.hero.title}</h1>
            <p className="text-xl md:text-2xl mb-4">{productsData.hero.subtitle}</p>
            <p className="text-lg text-white/90 max-w-4xl mx-auto">{productsData.hero.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {productsData.stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Product Portfolio</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {productsData.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-xl gradient-text">{product.name}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </div>
                    <p className="text-gray-600">{product.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                          Key Features
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {product.features.map((feature, idx) => (
                            <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Code className="h-4 w-4 text-secondary mr-2" />
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {product.technologies.map((tech, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-700 font-medium">{product.impact}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        {product.website !== '#' && (
                          <Button 
                            variant="gradient" 
                            className="flex-1"
                            onClick={() => window.open(product.website, '_blank')}
                          >
                            <Globe className="mr-2 h-4 w-4" />
                            Visit Website
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => window.location.href = '/contact'}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Have a Product Idea?</h2>
          <p className="text-xl mb-8">Let's collaborate to build the next innovative solution for India</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => window.location.href = '/collaborate'}>
              <Users className="mr-2 h-5 w-5" />
              Collaborate with Us
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" onClick={() => window.location.href = '/contact'}>
              Discuss Your Idea
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}