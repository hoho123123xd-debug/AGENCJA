import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { RenderBlocks } from '@/components/RenderBlocks'

// Renderowanie dynamiczne: treść czytana z D1 przy każdym żądaniu (Local
// API, bez sieci). Cache/ISR oparty o R2 to świadomie odłożony punkt
// rozszerzenia — patrz docs/cloudflare-decisions.md.
export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

const getData = async (slug: string) => {
  const payload = await getPayloadClient()
  const [{ docs }, settings] = await Promise.all([
    payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 }),
    payload.findGlobal({ slug: 'settings' }),
  ])
  return { page: docs[0] ?? null, settings }
}

export const generateMetadata = async ({ params }: Args): Promise<Metadata> => {
  const { slug } = await params
  const { page, settings } = await getData(slug)
  return buildMetadata(page, settings)
}

export default async function GenericPage({ params }: Args) {
  const { slug } = await params
  const { page } = await getData(slug)

  if (!page) notFound()

  return (
    <article>
      <RenderBlocks blocks={page.layout} />
    </article>
  )
}
