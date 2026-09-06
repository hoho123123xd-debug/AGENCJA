import type { Solution } from '@/content/home'
import styles from './SolutionsSelector.module.css'

/** Własna, abstrakcyjna wizualizacja per kategoria rozwiązania — bez zdjęć stockowych. */
export const SolutionVisual = ({ icon }: { icon: Solution['icon'] }) => {
  switch (icon) {
    case 'web':
      return (
        <div className={styles.visualWeb}>
          <div className={styles.visualBrowserBar}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.visualWebHero}>
            <div className={styles.visualWebLine} />
            <div className={styles.visualWebLine} style={{ width: '55%' }} />
          </div>
          <div className={styles.visualWebGrid}>
            <span />
            <span />
            <span />
          </div>
        </div>
      )
    case 'shop':
      return (
        <div className={styles.visualShop}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.visualShopCard}>
              <div className={styles.visualShopImg} />
              <span />
            </div>
          ))}
        </div>
      )
    case 'app':
      return (
        <div className={styles.visualApp}>
          <div className={styles.visualAppSide}>
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className={styles.visualAppMain}>
            <div className={styles.visualAppStats}>
              <div className={styles.visualAppStat} />
              <div className={styles.visualAppStat} />
              <div className={styles.visualAppStat} />
            </div>
            <div className={styles.visualAppChart} />
          </div>
        </div>
      )
    case 'system':
      return (
        <svg className={styles.visualSystem} viewBox="0 0 320 220" fill="none" aria-hidden="true">
          <g stroke="var(--line-hairline-strong)" strokeWidth="1.4">
            <line x1="160" y1="110" x2="60" y2="50" />
            <line x1="160" y1="110" x2="260" y2="50" />
            <line x1="160" y1="110" x2="60" y2="170" />
            <line x1="160" y1="110" x2="260" y2="170" />
            <line x1="160" y1="110" x2="160" y2="30" />
          </g>
          <circle cx="160" cy="110" r="22" fill="var(--pink-500)" opacity="0.9" />
          {[
            [60, 50],
            [260, 50],
            [60, 170],
            [260, 170],
            [160, 30],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="10" fill="var(--bg-panel-raised)" stroke="var(--line-hairline-strong)" />
          ))}
        </svg>
      )
    case 'automation':
      return (
        <div className={styles.visualAutomation}>
          {['Zgłoszenie', 'Walidacja', 'Akcja', 'Powiadomienie'].map((step, index) => (
            <div key={step} className={styles.visualAutomationStep}>
              <span>{step}</span>
              {index < 3 ? <em aria-hidden="true">→</em> : null}
            </div>
          ))}
        </div>
      )
    case 'integration':
    default:
      return (
        <svg className={styles.visualSystem} viewBox="0 0 320 220" fill="none" aria-hidden="true">
          <g stroke="var(--line-hairline-strong)" strokeWidth="1.4">
            <line x1="160" y1="110" x2="70" y2="60" />
            <line x1="160" y1="110" x2="70" y2="160" />
            <line x1="160" y1="110" x2="250" y2="60" />
            <line x1="160" y1="110" x2="250" y2="160" />
          </g>
          <rect x="132" y="82" width="56" height="56" rx="14" fill="var(--pink-500)" opacity="0.9" />
          {[
            [70, 60],
            [70, 160],
            [250, 60],
            [250, 160],
          ].map(([cx, cy]) => (
            <rect
              key={`${cx}-${cy}`}
              x={cx - 16}
              y={cy - 16}
              width="32"
              height="32"
              rx="9"
              fill="var(--bg-panel-raised)"
              stroke="var(--line-hairline-strong)"
            />
          ))}
        </svg>
      )
  }
}
