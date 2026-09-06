'use client'

import { useState } from 'react'

import { demos } from '@/content/home'
import { Reveal } from '@/components/Reveal'
import { DemoVisual } from './DemoVisual'
import styles from './Showroom.module.css'

export const Showroom = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = demos[activeIndex]

  return (
    <section id="showroom" className={`section ${styles.section}`} aria-label="Showroom">
      <div className="container">
        <Reveal as="p" className="eyebrow">
          Możliwości
        </Reveal>
        <Reveal as="h2" className={styles.heading} delay={60}>
          Nie musisz nam wierzyć na słowo. <span className="gradientText">Sprawdź sam.</span>
        </Reveal>
        <Reveal as="p" className={styles.lede} delay={120}>
          Przetestuj nasze interaktywne demo i zobacz, jak mogą wyglądać Twoje rozwiązania.
        </Reveal>

        <Reveal className={styles.tabs} delay={180}>
          <div role="tablist" aria-label="Wybierz demo">
            {demos.map((demo, index) => (
              <button
                key={demo.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? styles.tabActive : styles.tab}
                onClick={() => setActiveIndex(index)}
              >
                <span className={styles.tabIndex}>{String(index + 1).padStart(2, '0')}</span>
                {demo.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className={styles.frameWrap} delay={220}>
          <div className={styles.frame}>
            <div className={styles.frameBar}>
              <div className={styles.frameDots}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.frameUrl}>agencjastron.pl/showroom/{active.id}</div>
            </div>

            <div key={active.id} className={styles.frameBody}>
              <div className={styles.frameInfo}>
                <span className={styles.frameEyebrow}>Interaktywne demo</span>
                <h3>{active.title}</h3>
                <p>{active.description}</p>
                <div className={styles.frameActions}>
                  <button type="button" className="btn btnPrimary">
                    Otwórz showroom
                    <span className="btnIcon" aria-hidden="true">
                      →
                    </span>
                  </button>
                  <button type="button" className="btn btnSecondary">
                    Zobacz opis
                  </button>
                </div>
              </div>
              <div className={styles.frameVisual}>
                <DemoVisual id={active.id} />
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            <div className={styles.dots}>
              {demos.map((demo, index) => (
                <button
                  key={demo.id}
                  type="button"
                  aria-label={`Pokaż demo: ${demo.label}`}
                  aria-current={index === activeIndex}
                  className={index === activeIndex ? styles.dotActive : styles.dot}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <div className={styles.arrows}>
              <button
                type="button"
                aria-label="Poprzednie demo"
                onClick={() => setActiveIndex((i) => (i - 1 + demos.length) % demos.length)}
              >
                ←
              </button>
              <span className={styles.counter}>
                {String(activeIndex + 1).padStart(2, '0')} / {String(demos.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                aria-label="Następne demo"
                onClick={() => setActiveIndex((i) => (i + 1) % demos.length)}
              >
                →
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
