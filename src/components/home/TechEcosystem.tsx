'use client'

import { useMemo, useState } from 'react'

import { technologies } from '@/content/home'
import { Reveal } from '@/components/Reveal'
import styles from './TechEcosystem.module.css'

const RADIUS = 40

export const TechEcosystem = () => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = technologies.find((tech) => tech.id === activeId) ?? null

  const positioned = useMemo(
    () =>
      technologies.map((tech, index) => {
        const angle = (index / technologies.length) * Math.PI * 2 - Math.PI / 2
        return {
          ...tech,
          x: 50 + RADIUS * Math.cos(angle),
          y: 50 + RADIUS * Math.sin(angle),
        }
      }),
    [],
  )

  return (
    <section id="technologie" className={`section ${styles.section}`} aria-label="Technologie">
      <div className="container">
        <Reveal as="p" className="eyebrow">
          Technologie
        </Reveal>
        <Reveal as="h2" className={styles.heading} delay={60}>
          Nowoczesne narzędzia. <span className="gradientText">Realne możliwości.</span>
        </Reveal>
        <Reveal as="p" className={styles.lede} delay={120}>
          Pracujemy ze sprawdzonymi technologiami, aby dostarczać wydajne, bezpieczne i skalowalne rozwiązania.
          Kliknij technologię, aby zobaczyć jej zastosowanie.
        </Reveal>

        <Reveal className={styles.orbitWrap} delay={180}>
          <div className={styles.orbit}>
            <svg className={styles.orbitLines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {positioned.map((tech) => (
                <line
                  key={tech.id}
                  x1="50"
                  y1="50"
                  x2={tech.x}
                  y2={tech.y}
                  stroke={tech.id === activeId ? 'var(--pink-500)' : 'var(--line-hairline-strong)'}
                  strokeWidth={tech.id === activeId ? 0.5 : 0.3}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            <div className={styles.hub}>
              {active ? (
                <>
                  <span className={styles.hubLabel}>{active.label}</span>
                  <p className={styles.hubUsage}>{active.usage}</p>
                </>
              ) : (
                <>
                  <span className={styles.hubLabel}>Twój produkt</span>
                  <p className={styles.hubUsage}>Kliknij dowolną technologię, aby poznać jej rolę w projekcie.</p>
                </>
              )}
            </div>

            {positioned.map((tech) => (
              <button
                key={tech.id}
                type="button"
                className={`${styles.node} ${tech.id === activeId ? styles.nodeActive : ''}`}
                style={{ left: `${tech.x}%`, top: `${tech.y}%` }}
                onClick={() => setActiveId((current) => (current === tech.id ? null : tech.id))}
                aria-pressed={tech.id === activeId}
              >
                <span className={styles.nodeMonogram}>{tech.label.slice(0, 2)}</span>
                <span className={styles.nodeLabel}>{tech.label}</span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
