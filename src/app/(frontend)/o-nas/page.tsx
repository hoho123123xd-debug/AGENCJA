import type { Metadata } from 'next'

import { Reveal } from '@/components/Reveal'
import { FinalCta } from '@/components/home/FinalCta'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'O nas — Agencja Stron',
  description: 'Poznaj podejście stojące za Agencją Stron — dlaczego rozwiązujemy problemy, zanim zaczniemy projektować.',
}

const VALUES = [
  {
    title: 'Problem przed pikselem',
    description: 'Zanim zaprojektujemy interfejs, rozumiemy proces biznesowy, który ma usprawnić.',
  },
  {
    title: 'Technologia dopasowana, nie modna',
    description: 'Dobieramy stack pod realne wymagania projektu, nie pod trendy.',
  },
  {
    title: 'Partnerstwo po wdrożeniu',
    description: 'Nie znikamy po starcie — rozwijamy rozwiązanie razem z Twoim biznesem.',
  },
]

export default function ONasPage() {
  return (
    <>
      <section className={`section ${styles.hero}`} aria-label="O nas">
        <div className="container">
          <Reveal as="p" className="eyebrow">
            O nas
          </Reveal>
          <Reveal as="h1" className={styles.heading} delay={60}>
            Ludzie i podejście za <span className="gradientText">Agencją Stron.</span>
          </Reveal>
          <Reveal as="p" className={styles.lede} delay={120}>
            Jesteśmy zespołem, który traktuje stronę czy aplikację jako narzędzie biznesowe, nie tylko wizytówkę.
            Każdy projekt zaczynamy od pytania „jaki problem rozwiązujemy&rdquo;, a dopiero potem przechodzimy do designu
            i technologii.
          </Reveal>

          <Reveal className={styles.values} delay={200}>
            {VALUES.map((value) => (
              <div key={value.title} className={styles.value}>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
      <FinalCta />
    </>
  )
}
