import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const serverURL = process.env.SERVER_URL || 'http://localhost:3000'
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/admin' }],
    sitemap: `${serverURL}/sitemap.xml`,
  }
}
