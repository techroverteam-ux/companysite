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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Global Presence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Serving clients worldwide with our technology solutions and products
          </p>
        </motion.div>

        <div className="relative bg-white rounded-2xl shadow-xl p-8 overflow-hidden">
          {/* Interactive World Map */}
          <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl overflow-hidden">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold gradient-text">8+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold gradient-text">76+</div>
              <div className="text-sm text-gray-600">Active Clients</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold gradient-text">31+</div>
              <div className="text-sm text-gray-600">Products Running</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-gray-600">Global Support</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}