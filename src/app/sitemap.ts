import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const serverURL = process.env.SERVER_URL || 'http://localhost:3000'

  const { docs } = await payload.find({
    collection: 'pages',
    where: { 'seo.noIndex': { not_equals: true } },
    limit: 1000,
    depth: 0,
  })

  return docs.map((page) => ({
    url: page.slug === 'home' ? serverURL : `${serverURL}/${page.slug}`,
    lastModified: page.updatedAt,
  }))
}
