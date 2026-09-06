'use client'

import { useEffect, useRef, useState } from 'react'

import { processSteps } from '@/content/home'
import { Reveal } from '@/components/Reveal'
import styles from './Process.module.css'

// Współrzędne w % kontenera — SVG i znaczniki HTML dzielą ten sam układ,
// więc skalują się razem niezależnie od szerokości ekranu.
const POINTS = [
  { x: 6, y: 62 },
  { x: 27, y: 22 },
  { x: 50, y: 68 },
  { x: 73, y: 18 },
  { x: 94, y: 50 },
]

const pathFromPoints = (points: typeof POINTS) =>
  points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

export const Process = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="proces" className={`section ${styles.section}`} aria-label="Proces współpracy">
      <div className="container">
        <div className={styles.head}>
          <div>
            <Reveal as="p" className="eyebrow">
              Jak pracujemy
            </Reveal>
            <Reveal as="h2" className={styles.heading} delay={60}>
              Od pomysłu do działającego <span className="gradientText">rozwiązania.</span>
            </Reveal>
            <Reveal as="p" className={styles.lede} delay={120}>
              Łączymy strategię, design i technologię, aby przeprowadzić Cię przez cały proces — jasno, skutecznie i
              bez zbędnego komplikowania.
            </Reveal>
          </div>

          <Reveal className={styles.aside} delay={160}>
            <span className={styles.asideTitle}>Nie zostawiamy Cię po starcie.</span>
            <span className={styles.asideText}>Zapewniamy wsparcie, rozwój i realne partnerstwo.</span>
          </Reveal>
        </div>

        <div className={styles.path} ref={sectionRef}>
          <svg
            className={styles.pathSvg}
            viewBox="0 0 100 90"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={pathFromPoints(POINTS)}
              fill="none"
              stroke="var(--line-hairline-strong)"
              strokeWidth="0.35"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className={drawn ? styles.pathDrawn : styles.pathLine}
              d={pathFromPoints(POINTS)}
              fill="none"
              stroke="url(#processGradient)"
              strokeWidth="0.45"
              strokeLinecap="round"
              pathLength={100}
              vectorEffect="non-scaling-stroke"
            />
            <defs>
              <linearGradient id="processGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--pink-500)" />
                <stop offset="100%" stopColor="var(--navy-500)" />
              </linearGradient>
            </defs>
          </svg>

          {processSteps.map((step, index) => {
            const point = POINTS[index]
            const flip = point.y < 45
            return (
              <Reveal key={step.index} className={styles.node} delay={index * 140}>
                <div
                  className={styles.nodeInner}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                  <span className={styles.nodeDot}>{step.index}</span>
                  <div className={`${styles.nodeCard} ${flip ? styles.nodeCardBelow : styles.nodeCardAbove}`}>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
