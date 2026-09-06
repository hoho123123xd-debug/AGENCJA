import Link from 'next/link'

import { Reveal } from '@/components/Reveal'
import styles from './FinalCta.module.css'

export const FinalCta = () => (
  <section id="kontakt" className={`section ${styles.section}`} aria-label="Kontakt">
    <div className={styles.grid} aria-hidden="true" />
    <div className={styles.glow} aria-hidden="true" />

    <div className={`container ${styles.inner}`}>
      <Reveal as="p" className="eyebrow">
        Gotowy na rozmowę?
      </Reveal>

      <Reveal as="h2" className={styles.heading} delay={80}>
        Masz pomysł?
        <br />
        <span className="gradientText">Zbudujmy go.</span>
      </Reveal>

      <Reveal as="p" className={styles.lede} delay={160}>
        Niezależnie od tego, czy masz już konkretny pomysł, czy dopiero szukasz rozwiązania — odezwij się. Wspólnie
        znajdziemy najlepszą drogę.
      </Reveal>

      <Reveal delay={240}>
        <Link href="mailto:hello@agencjastron.pl" className={`btn btnPrimary ${styles.cta}`}>
          Porozmawiajmy o projekcie
          <span className="btnIcon" aria-hidden="true">
            →
          </span>
        </Link>
      </Reveal>

      <Reveal as="div" className={styles.contactRow} delay={300}>
        <div>
          <span className={styles.contactLabel}>Napisz do nas</span>
          <a href="mailto:hello@agencjastron.pl">hello@agencjastron.pl</a>
        </div>
        <div>
          <span className={styles.contactLabel}>Zadzwoń</span>
          <a href="tel:+48123456789">+48 123 456 789</a>
        </div>
        <div>
          <span className={styles.contactLabel}>Lublin, Polska</span>
          <span>Pracujemy zdalnie na terenie całej Polski</span>
        </div>
      </Reveal>
    </div>
  </section>
)
