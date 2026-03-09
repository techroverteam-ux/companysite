'use client'

import { motion } from 'framer-motion'
import { MapPin, Globe, Users, Zap } from 'lucide-react'

const clientLocations = [
  { country: 'India', clients: 25, products: 8, x: 77, y: 28 },
  { country: 'USA', clients: 12, products: 5, x: 25, y: 25 },
  { country: 'UK', clients: 8, products: 4, x: 50, y: 20 },
  { country: 'Canada', clients: 6, products: 3, x: 20, y: 18 },
  { country: 'Australia', clients: 4, products: 2, x: 85, y: 70 },
  { country: 'Germany', clients: 7, products: 3, x: 52, y: 22 },
  { country: 'Singapore', clients: 5, products: 2, x: 78, y: 50 },
  { country: 'UAE', clients: 9, products: 4, x: 65, y: 35 }
]

export function WorldMap() {
  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-14 sm:mb-16"
        >
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
            WORLDWIDE
          </div>

          <h2 className="mx-auto max-w-4xl text-balance text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            <span className="gradient-text">Global</span> Presence
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-[1.85] text-muted-foreground sm:text-lg">
            Serving clients worldwide with our technology solutions and products
          </p>
        </motion.div>

        <div className="relative bg-card rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 overflow-hidden border border-border">
          {/* Interactive World Map */}
          <div className="relative w-full h-56 sm:h-72 md:h-96 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50446080.89164513!2d-95.677068!3d37.6000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDM2JzAwLjAiTiA5NcKwNDAnMzcuNCJX!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin&markers=color:red%7C28.6139,77.2090%7C40.7128,-74.0060%7C51.5074,-0.1278%7C45.4215,-75.6972%7C-33.8688,151.2093%7C52.5200,13.4050%7C1.3521,103.8198%7C25.2048,55.2708"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TechRover Global Presence"
            />


          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold gradient-text">8+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold gradient-text">76+</div>
              <div className="text-sm text-muted-foreground">Active Clients</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold gradient-text">31+</div>
              <div className="text-sm text-muted-foreground">Products Running</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-muted-foreground">Global Support</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}