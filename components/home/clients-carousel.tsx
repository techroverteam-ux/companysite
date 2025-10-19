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
  const clientsData = clientsDataRaw.data && typeof clientsDataRaw.data === 'string'
    ? decrypt(clientsDataRaw.data) || []
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
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold mb-2">
            Trusted by <span className="gradient-text">Leading Companies</span> Worldwide
          </h3>
          <p className="text-gray-600 mb-8">Join 100+ companies that trust Techrover for their technology needs</p>
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
                <Card className="h-32 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-lg">
                  <CardContent className="p-4 h-full flex flex-col justify-between">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{client.logo}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">{client.name}</h3>
                        <p className="text-xs text-gray-500">{client.industry} • {client.country}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{client.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-secondary font-medium">{client.projectsCompleted} Projects</span>
                      <span className="text-xs text-green-600 font-medium">{client.totalValue}</span>
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