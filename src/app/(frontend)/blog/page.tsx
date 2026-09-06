import type { Metadata } from 'next'

import { Reveal } from '@/components/Reveal'
import { FinalCta } from '@/components/home/FinalCta'

export const metadata: Metadata = {
  title: 'Blog — Agencja Stron',
  description: 'Wkrótce: teksty o projektowaniu, technologii i rozwiązywaniu problemów biznesowych.',
}

export default function BlogPage() {
  return (
    <>
      <section className="section" aria-label="Blog">
        <div className="container placeholder">
          <Reveal as="p" className="eyebrow">
            Blog
          </Reveal>
          <Reveal as="h1" className="pageHeading" delay={60}>
            Piszemy o tym, co <span className="gradientText">robimy.</span>
          </Reveal>
          <Reveal as="p" delay={120}>
            Pierwsze teksty o projektowaniu, technologii i procesach, które stosujemy w projektach, pojawią się tu
            wkrótce.
          </Reveal>
        </div>
      </section>
      <FinalCta />
    </>
  )
}
