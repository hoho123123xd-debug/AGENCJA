import type { Metadata } from 'next'
import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { RenderBlocks } from '@/components/RenderBlocks'

export const dynamic = 'force-dynamic'

const getData = async () => {
  const payload = await getPayloadClient()
  const [{ docs }, settings] = await Promise.all([
    payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 }),
    payload.findGlobal({ slug: 'settings' }),
  ])
  return { page: docs[0] ?? null, settings }
}

export const generateMetadata = async (): Promise<Metadata> => {
  const { page, settings } = await getData()
  return buildMetadata(page, settings)
}

export default async function HomePage() {
  const { page } = await getData()

  if (!page) {
    return (
      <section className="placeholder">
        <h1>Fundament techniczny gotowy.</h1>
        <p>
          Nie utworzono jeszcze strony ze slugiem <code>home</code>. Zaloguj się do{' '}
          <Link href="/admin">panelu administracyjnego</Link> i utwórz pierwszą stronę w kolekcji Pages, żeby zobaczyć
          ją tutaj.
        </p>
      </section>
    )
  }

  return (
    <article>
      <RenderBlocks blocks={page.layout} />
    </article>
  )
}
