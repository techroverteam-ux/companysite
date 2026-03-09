'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Zap, ShoppingCart, Smartphone, Globe, TrendingUp } from 'lucide-react'
import { Navbar } from '@/components/navbar/navbar'
import { Footer } from '@/components/footer/footer'

const shopifyServices = [
  {
    title: "Custom Shopify Store Development",
    price: "₹22,500",
    description: "Complete custom Shopify store built from scratch",
    features: ["Custom Theme Design", "Mobile Responsive", "Payment Integration", "SEO Optimized"]
  },
  {
    title: "WordPress to Shopify Migration",
    price: "₹25,000", 
    description: "Seamless migration from WordPress to Shopify with zero downtime",
    features: ["Data Migration", "Design Recreation", "SEO Preservation", "Testing & Launch"]
  },
  {
    title: "Shopify Plus Development",
    price: "₹45,000",
    description: "Enterprise-level Shopify Plus stores for high-volume businesses",
    features: ["Advanced Customization", "Multi-store Setup", "B2B Features", "Advanced Analytics"]
  }
]

const migrationSteps = [
  { step: 1, title: "Analysis", description: "Analyze your current WordPress store" },
  { step: 2, title: "Planning", description: "Create migration strategy and timeline" },
  { step: 3, title: "Design", description: "Recreate your design in Shopify" },
  { step: 4, title: "Migration", description: "Transfer products, customers, and orders" },
  { step: 5, title: "Testing", description: "Thorough testing and optimization" },
  { step: 6, title: "Launch", description: "Go live with zero downtime" }
]

export default function ShopifyPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-muted/50 py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              E-COMMERCE
            </div>
            <div className="flex items-center justify-center mb-6">
              <ShoppingCart className="h-12 w-12 mr-4 text-primary" />
              <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
                Shopify <span className="gradient-text">Development</span>
              </h1>
            </div>
            <p className="mx-auto mt-3 max-w-4xl text-base leading-[1.85] text-muted-foreground sm:text-lg md:text-xl">
              Transform your e-commerce business with custom Shopify stores and seamless WordPress migrations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" variant="gradient" onClick={() => window.location.href = '/contact'}>
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                View Portfolio
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="gradient-text">Shopify Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From custom development to seamless migrations, we've got your Shopify needs covered
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {shopifyServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <div className="text-3xl font-bold gradient-text">{service.price}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="gradient" className="w-full" onClick={() => window.location.href = '/contact'}>
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Process */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              WordPress to Shopify <span className="gradient-text">Migration Process</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our proven 6-step process ensures a smooth transition with zero downtime
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {migrationSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  {index < migrationSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-secondary transform -translate-y-1/2" />
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">TechRover</span> for Shopify?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Fast Delivery", desc: "Quick turnaround times" },
              { icon: Globe, title: "SEO Optimized", desc: "Built for search engines" },
              { icon: Smartphone, title: "Mobile First", desc: "Responsive on all devices" },
              { icon: TrendingUp, title: "Conversion Focused", desc: "Designed to sell" }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Launch Your Shopify Store?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get a free consultation and quote for your Shopify project today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="gradient" onClick={() => window.location.href = '/contact'}>
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.location.href = '/schedule'}>
                Schedule Call
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}