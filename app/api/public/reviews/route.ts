import { NextResponse } from 'next/server'
import { route } from '@/lib/api'
import { Review } from '@/lib/models'

export const dynamic = 'force-dynamic'

/** Published client reviews for the website. */
export const GET = route(async () => {
  const list = await Review.find({ status: 'published', consent: true }).sort({ publishedAt: -1 }).limit(100).lean()
  const reviews = list.map((r) => ({
    id: String(r._id),
    clientName: r.name,
    role: r.role,
    company: r.company,
    rating: r.rating,
    review: r.text,
    project: r.whatWeBuilt,
    projectType: r.whatWeBuilt,
    verified: r.verified,
    date: r.publishedAt,
  }))
  const avg = reviews.length ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10 : 0
  return NextResponse.json({ reviews, aggregate: { count: reviews.length, average: avg } }, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } })
})
