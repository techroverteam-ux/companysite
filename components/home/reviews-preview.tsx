'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Quote, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Review {
  id: string
  clientName: string
  company: string
  country: string
  rating: number
  review: string
  projectType: string
}

interface ReviewsPreviewProps {
  reviews: Review[]
}

export function ReviewsPreview({ reviews }: ReviewsPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sectionEase = [0.22, 1, 0.36, 1] as const

  useEffect(() => {
    if (!isAutoPlaying || !Array.isArray(reviews) || reviews.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [reviews.length, isAutoPlaying])

  const nextReview = () => {
    if (!Array.isArray(reviews) || reviews.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
    setIsAutoPlaying(false)
  }

  const prevReview = () => {
    if (!Array.isArray(reviews) || reviews.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative overflow-hidden bg-muted/50 py-14 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-48 w-48 sm:h-64 sm:w-64 lg:h-80 lg:w-80 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-48 w-48 sm:h-72 sm:w-72 lg:h-96 lg:w-96 rounded-full bg-secondary/[0.05] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: sectionEase }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-10 text-center sm:mb-12"
        >
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
            CLIENT REVIEWS
          </div>

          <h2 className="mx-auto max-w-4xl text-balance text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-[1.85] text-muted-foreground sm:text-lg">
            Real feedback from businesses we&apos;ve helped transform through technology
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Card className="border-border/70 bg-card/80 shadow-sm backdrop-blur">
                <CardContent className="p-5 sm:p-8 md:p-12">
                  <div className="text-center">
                    <Quote className="mx-auto mb-6 h-10 w-10 text-primary/20" />

                    <div className="mb-6 flex justify-center">
                      <div className="flex text-yellow-500">
                        {[...Array(reviews[currentIndex]?.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="mb-8 text-lg leading-relaxed text-foreground/90 md:text-xl">
                      &ldquo;{reviews[currentIndex]?.review}&rdquo;
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-secondary/20">
                        <span className="text-lg font-bold text-primary">
                          {reviews[currentIndex]?.clientName.charAt(0)}
                        </span>
                      </div>
                      <div className="text-left">
                        <h4 className="text-base font-semibold text-foreground">{reviews[currentIndex]?.clientName}</h4>
                        <p className="text-sm text-muted-foreground">{reviews[currentIndex]?.company}</p>
                        <p className="text-xs text-muted-foreground">{reviews[currentIndex]?.country}</p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <span className="rounded-full border border-border/80 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                        {reviews[currentIndex]?.projectType}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <button
            onClick={prevReview}
            className="absolute -left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border/80 bg-card/80 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground sm:left-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={nextReview}
            className="absolute -right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border/80 bg-card/80 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground sm:right-2"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {Array.isArray(reviews) && reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsAutoPlaying(false)
                }}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary scale-110'
                    : 'bg-border hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: sectionEase }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 text-center"
        >
          <Link href="/reviews">
            <Button size="lg" variant="gradient" className="group">
              Read All Reviews
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}