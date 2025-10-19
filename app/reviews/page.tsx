'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'
import reviewsDataRaw from '@/data/reviews.json'
import { decrypt } from '@/lib/auth'

export default function ReviewsPage() {
  // Decrypt reviews data if encrypted
  const reviewsData = reviewsDataRaw.data && typeof reviewsDataRaw.data === 'string' 
    ? decrypt(reviewsDataRaw.data) || []
    : reviewsDataRaw || []

  return (
    <div className="pt-16">
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Client Reviews</h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto text-white/90">
              What our clients say about working with Techrover
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(reviewsData) && reviewsData.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">
                          {review.clientName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{review.clientName}</h3>
                        <p className="text-sm text-gray-500">{review.company}</p>
                        <p className="text-xs text-gray-400">{review.country}</p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">({review.rating}/5)</span>
                    </div>

                    <div className="relative mb-4">
                      <Quote className="h-8 w-8 text-gray-200 absolute -top-2 -left-2" />
                      <p className="text-gray-600 italic pl-6">"{review.review}"</p>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                        {review.projectType}
                      </span>
                      <span className="text-gray-400">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
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