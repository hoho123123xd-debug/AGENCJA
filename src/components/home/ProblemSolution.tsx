import type { CSSProperties } from 'react'

import { problemStages, solutionStages } from '@/content/home'
import { Reveal } from '@/components/Reveal'
import styles from './ProblemSolution.module.css'

export const ProblemSolution = () => (
  <section className={`section ${styles.section}`} aria-label="Problem i rozwiązanie">
    <div className="container">
      <Reveal as="p" className="eyebrow">
        Dlaczego to działa
      </Reveal>
      <Reveal as="h2" className={styles.heading} delay={60}>
        Chaos zamienia się w <span className="gradientText">system.</span>
      </Reveal>

      <div className={styles.grid}>
        <div className={styles.chaosSide} aria-hidden="true">
          {problemStages.map((stage, index) => (
            <span
              key={stage}
              className={styles.chaosWord}
              style={
                {
                  '--rot': `${[-6, 4, -3, 7][index]}deg`,
                  '--x': `${[2, 34, 10, 46][index]}%`,
                  '--y': `${[6, 30, 58, 78][index]}%`,
                  '--fade': 1 - index * 0.16,
                } as CSSProperties
              }
            >
              {stage}
            </span>
          ))}
        </div>

        <div className={styles.connector}>
          <span className={styles.connectorLine} />
          <span className={styles.connectorDot} />
        </div>

        <Reveal as="ul" className={styles.solutionSide}>
          {solutionStages.map((stage, index) => (
            <li key={stage}>
              <span className={styles.solutionIndex}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.solutionLabel}>{stage}</span>
              <span className={styles.solutionCheck} aria-hidden="true">
                ✓
              </span>
            </li>
          ))}
        </Reveal>
      </div>

      <p className="visuallyHidden">
        Od problemu ({problemStages.join(', ').toLowerCase()}) do rozwiązania (
        {solutionStages.join(', ').toLowerCase()}).
      </p>
    </div>
  </section>
)
