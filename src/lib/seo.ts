import type { Metadata } from 'next'
import type { Page, Setting } from '@/payload-types'

const mediaUrl = (media: unknown): string | undefined => {
  if (media && typeof media === 'object' && 'url' in media && media.url) return media.url as string
  return undefined
}

/** Buduje next/Metadata z SEO strony, z fallbackiem na ustawienia globalne. */
export const buildMetadata = (page: Page | null, settings: Setting | null): Metadata => {
  const title = page?.seo?.title || page?.title || settings?.defaultSeo?.title || settings?.siteName || 'Agencja'
  const description = page?.seo?.description || settings?.defaultSeo?.description || undefined
  const ogImage = mediaUrl(page?.seo?.ogImage) || mediaUrl(settings?.defaultSeo?.ogImage)

  return {
    title,
    description,
    alternates: page?.seo?.canonicalUrl ? { canonical: page.seo.canonicalUrl } : undefined,
    robots: page?.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
