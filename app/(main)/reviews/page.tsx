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
      <section className="bg-muted/50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              CLIENT REVIEWS
            </div>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
              Client <span className="gradient-text">Reviews</span>
            </h1>
            <p className="mx-auto mt-5 max-w-4xl text-base leading-[1.85] text-muted-foreground sm:text-lg md:text-xl">
              What our clients say about working with Techrover
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(reviewsData) && reviewsData.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
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
                        <p className="text-sm text-muted-foreground">{review.company}</p>
                        <p className="text-xs text-muted-foreground/70">{review.country}</p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
                    </div>

                    <div className="relative mb-4">
                      <Quote className="h-8 w-8 text-muted-foreground/20 absolute -top-2 -left-2" />
                      <p className="text-muted-foreground italic pl-6">"{review.review}"</p>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                        {review.projectType}
                      </span>
                      <span className="text-muted-foreground/70">
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