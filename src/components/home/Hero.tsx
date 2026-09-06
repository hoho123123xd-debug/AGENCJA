'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

import { Reveal } from '@/components/Reveal'
import styles from './Hero.module.css'

const FEATURES = [
  { icon: '◈', label: 'Indywidualne podejście' },
  { icon: '⌁', label: 'Nowoczesne technologie' },
  { icon: '♡', label: 'Pełne wsparcie' },
  { icon: '◎', label: 'Skupienie na rezultatach' },
]

/** Tilt 3D kompozycji produktowej podążający za kursorem (z poszanowaniem reduced-motion). */
const useTilt = () => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return

    let frame = 0

    const onMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5

      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        node.style.setProperty('--tilt-x', `${(-py * 8).toFixed(2)}deg`)
        node.style.setProperty('--tilt-y', `${(px * 10).toFixed(2)}deg`)
      })
    }

    const onLeave = () => {
      cancelAnimationFrame(frame)
      node.style.setProperty('--tilt-x', '0deg')
      node.style.setProperty('--tilt-y', '0deg')
    }

    node.addEventListener('mousemove', onMove)
    node.addEventListener('mouseleave', onLeave)
    return () => {
      node.removeEventListener('mousemove', onMove)
      node.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return ref
}

export const Hero = () => {
  const tiltRef = useTilt()

  return (
    <section className={styles.hero} aria-label="Wprowadzenie">
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <Reveal as="p" className={`eyebrow ${styles.eyebrow}`}>
            Strategia × Design × Technologia
          </Reveal>

          <Reveal as="h1" className={styles.headline} delay={80}>
            Cyfrowe rozwiązania,
            <br />
            które napędzają
            <br />
            <span className="gradientText">Twój biznes.</span>
          </Reveal>

          <Reveal as="p" className={styles.lede} delay={160}>
            Projektujemy i tworzymy strony, sklepy, aplikacje i systemy, które rozwiązują realne problemy biznesowe,
            a&nbsp;nie tylko dobrze wyglądają.
          </Reveal>

          <Reveal as="div" className={styles.actions} delay={240}>
            <Link href="/kontakt" className="btn btnPrimary">
              Porozmawiajmy o projekcie
              <span className="btnIcon" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="#showroom" className="btn btnSecondary">
              <span className={styles.playIcon} aria-hidden="true">
                ▶
              </span>
              Zobacz, co możemy zbudować
            </Link>
          </Reveal>

          <Reveal as="ul" className={styles.features} delay={320}>
            {FEATURES.map((feature) => (
              <li key={feature.label}>
                <span aria-hidden="true">{feature.icon}</span>
                {feature.label}
              </li>
            ))}
          </Reveal>
        </div>

        <Reveal as="div" className={styles.showcaseWrap} delay={200}>
          <div className={styles.showcase} ref={tiltRef}>
            <div className={styles.laptop}>
              <div className={styles.laptopScreen}>
                <div className={styles.browserBar}>
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.siteMock}>
                  <div className={styles.siteNav}>
                    <div className={styles.siteLogo} />
                    <div className={styles.siteLinks}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                  <div className={styles.siteHero}>
                    <div className={styles.siteHeroText}>
                      <span className={styles.siteHeroLine} />
                      <span className={styles.siteHeroLine} style={{ width: '70%' }} />
                      <span className={`btn btnPrimary ${styles.siteCta}`}>Zobacz kolekcję</span>
                    </div>
                    <div className={styles.siteHeroArt} />
                  </div>
                </div>
              </div>
              <div className={styles.laptopBase} />
            </div>

            <div className={styles.phone}>
              <div className={styles.phoneNotch} />
              <div className={styles.phoneScreen}>
                <div className={styles.phoneHeader} />
                <div className={styles.phoneArt} />
                <div className={styles.phoneLine} />
                <div className={styles.phoneLine} style={{ width: '55%' }} />
                <span className={styles.phoneCta}>Dodaj do koszyka</span>
              </div>
            </div>

            <div className={`${styles.badge} ${styles.badgeTop}`}>
              <span className={styles.badgeDot} />
              Nowoczesny design, realne efekty
            </div>

            <div className={`${styles.badge} ${styles.badgeBottom}`}>
              <span className={styles.badgeLabel}>E-COMMERCE DEMO</span>
              Sprawdź działający sklep →
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
