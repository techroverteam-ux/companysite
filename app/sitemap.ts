import type { MetadataRoute } from 'next'
import caseStudies from '@/data/case-studies.json'

const SITE = process.env.SITE_URL || 'https://techrover.co.in'
const PAGES = ['', 'services', 'portfolio', 'products', 'about', 'team', 'reviews', 'contact', 'schedule', 'ai-agents', 'shopify', 'migration', 'calculator', 'hire-team', 'collaborate', 'privacy-policy', 'terms']

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const pages = PAGES.map((p) => ({ url: `${SITE}/${p}`, lastModified: now, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 }))
  const studies = (Array.isArray(caseStudies) ? caseStudies : [])
    .map((c: any) => c.slug || c.id)
    .filter(Boolean)
    .map((slug: string) => ({ url: `${SITE}/case-study/${slug}`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.5 }))
  return [...pages, ...studies]
}
