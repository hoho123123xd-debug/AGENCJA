'use client'

import { useState } from 'react'
import Link from 'next/link'

import { solutions } from '@/content/home'
import { Reveal } from '@/components/Reveal'
import { SolutionIcon } from './SolutionIcon'
import { SolutionVisual } from './SolutionVisual'
import styles from './SolutionsSelector.module.css'

export const SolutionsSelector = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = solutions[activeIndex]

  return (
    <section id="rozwiazania" className={`section ${styles.section}`} aria-label="Rozwiązania">
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <Reveal as="p" className="eyebrow">
            Rozwiązania
          </Reveal>
          <Reveal as="h2" className={styles.heading} delay={60}>
            Wybierz kierunek
            <br />
            rozwoju
          </Reveal>
          <Reveal as="p" className={styles.lede} delay={120}>
            Niezależnie od tego, czy potrzebujesz nowej strony, sklepu, aplikacji czy automatyzacji — mamy
            rozwiązanie dopasowane do Twoich celów.
          </Reveal>
          <Reveal delay={180}>
            <Link href="#showroom" className={styles.allLink}>
              Zobacz wszystkie rozwiązania
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>

          <ul className={styles.list} role="tablist" aria-label="Lista rozwiązań">
            {solutions.map((solution, index) => {
              const isActive = index === activeIndex
              return (
                <li key={solution.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <span className={styles.itemIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.itemIcon}>
                      <SolutionIcon icon={solution.icon} />
                    </span>
                    <span className={styles.itemText}>
                      <span className={styles.itemLabel}>{solution.label}</span>
                      <span className={styles.itemDesc}>{solution.description}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <Reveal as="div" className={styles.panelWrap} delay={100}>
          <div className={styles.panel}>
            <div key={active.id} className={styles.panelInner}>
              <div className={styles.panelVisual}>
                <SolutionVisual icon={active.icon} />
              </div>
              <div className={styles.panelFooter}>
                <div>
                  <h3>{active.label}</h3>
                  <p>{active.description}</p>
                </div>
                <div className={styles.panelStat}>
                  <span className={styles.panelStatValue}>{active.stat.value}</span>
                  <span className={styles.panelStatLabel}>{active.stat.label}</span>
                </div>
              </div>
            </div>

            <div className={styles.panelControls}>
              <span className={styles.panelCounter}>
                {String(activeIndex + 1).padStart(2, '0')} / {String(solutions.length).padStart(2, '0')}
              </span>
              <div className={styles.panelArrows}>
                <button
                  type="button"
                  aria-label="Poprzednie rozwiązanie"
                  onClick={() => setActiveIndex((i) => (i - 1 + solutions.length) % solutions.length)}
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Następne rozwiązanie"
                  onClick={() => setActiveIndex((i) => (i + 1) % solutions.length)}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
