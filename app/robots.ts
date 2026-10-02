import type { MetadataRoute } from 'next'

const SITE = process.env.SITE_URL || 'https://techrover.co.in'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/portal', '/p/', '/review/', '/login'] }],
    sitemap: `${SITE}/sitemap.xml`,
  }
}
