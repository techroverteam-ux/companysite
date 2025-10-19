'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import clientsDataRaw from '@/data/clients.json'
import { decrypt } from '@/lib/auth'

interface ClientsCarouselProps {
  clients: string[]
}

export function ClientsCarousel({ clients }: ClientsCarouselProps) {
  // Decrypt clients data if encrypted
  const clientsData = (clientsDataRaw as any).data && typeof (clientsDataRaw as any).data === 'string'
    ? decrypt((clientsDataRaw as any).data) || []
    : clientsDataRaw || []

  // Use detailed client data
  const duplicatedClients = [...clientsData, ...clientsData]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-primary mr-4"></div>
            <h3 className="text-3xl md:text-4xl font-bold">
              Trusted by <span className="gradient-text">Leading Companies</span> Worldwide
            </h3>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-secondary ml-4"></div>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join 100+ companies across 8+ countries that trust TechRover for their technology transformation
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold gradient-text mb-2">100+</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold gradient-text mb-2">8+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold gradient-text mb-2">500+</div>
              <div className="text-sm text-gray-600">Projects</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold gradient-text mb-2">99%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </motion.div>
          </div>
        </motion.div>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex space-x-12"
            animate={{
              x: [0, -50 * clients.length],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {duplicatedClients.map((client, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-80 mr-6"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-40 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-primary/5 hover:to-secondary/5 transition-all duration-500 shadow-lg hover:shadow-2xl group">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div className="flex items-start mb-3">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl"
                      >
                        <span className="text-xl text-white">{client.logo}</span>
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg group-hover:gradient-text transition-all duration-300">{client.name}</h3>
                        <p className="text-sm text-gray-500 mb-1">{client.industry}</p>
                        <p className="text-xs text-primary font-medium">{client.country}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 group-hover:text-gray-700">{client.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
                        <span className="text-sm text-secondary font-semibold">{client.projectsCompleted} Projects</span>
                      </div>
                      <span className="text-sm text-green-600 font-bold bg-green-50 px-2 py-1 rounded">{client.totalValue}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}