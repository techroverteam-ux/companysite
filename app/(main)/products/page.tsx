'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, Globe, Users, TrendingUp, Star, Eye, Filter, 
  Cloud, Brain, Smartphone, ArrowRight, Code 
} from 'lucide-react'
import productsData from '@/data/products-detailed.json'

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  
  const filteredProducts = selectedCategory === 'all' 
    ? productsData.products 
    : productsData.products.filter(product => product.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-green-100 text-green-800'
      case 'In Development': return 'bg-blue-100 text-blue-800'
      case 'Under Development': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SaaS Platforms': return Cloud
      case 'AI Tools': return Brain
      case 'Mobile Apps': return Smartphone
      case 'Web Platforms': return Globe
      default: return Code
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

      {/* Category Filter */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="flex items-center"
            >
              <Filter className="mr-2 h-4 w-4" />
              All Products
            </Button>
            {productsData.categories.map((category) => {
              const Icon = getCategoryIcon(category.name)
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.name)}
                  className="flex items-center"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
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
              Our <span className="gradient-text">Product Portfolio</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Innovative solutions designed to solve real-world problems and drive digital transformation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl gradient-text group-hover:text-primary transition-colors">
                          {product.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-secondary mr-2" />
                          <span>{product.users} users</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-green-600 text-xs">{product.impact}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Key Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 4).map((feature, idx) => (
                            <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                              {feature}
                            </span>
                          ))}
                          {product.features.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{product.features.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-3 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-1">Starting from</div>
                        <div className="text-lg font-bold gradient-text">{Object.values(product.pricing)[0]}</div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          variant="gradient" 
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        {product.website !== '#' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(product.website, '_blank')}
                          >
                            <Globe className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold gradient-text">{selectedProduct.name}</h2>
                  <p className="text-gray-600">{selectedProduct.category}</p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedProduct(null)}>×</Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-gray-600 mb-4">{selectedProduct.longDescription}</p>
                  
                  <h3 className="font-semibold mb-3">Key Features</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {selectedProduct.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Pricing Plans</h3>
                  <div className="space-y-3 mb-4">
                    {Object.entries(selectedProduct.pricing).map(([plan, price]) => (
                      <div key={plan} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="capitalize font-medium">{plan}</span>
                        <span className="font-bold text-primary">{String(price)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="font-semibold mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedProduct.technologies.map((tech: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button variant="gradient" onClick={() => window.location.href = '/contact'}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {selectedProduct.website !== '#' && (
                  <Button variant="outline" onClick={() => window.open(selectedProduct.website, '_blank')}>
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Have a Product Idea?</h2>
          <p className="text-xl mb-8">Let's collaborate to build the next innovative solution</p>
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