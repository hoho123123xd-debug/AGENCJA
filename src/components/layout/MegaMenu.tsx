import Link from 'next/link'

import { solutions } from '@/content/home'
import { SolutionIcon } from '@/components/home/SolutionIcon'
import styles from './MegaMenu.module.css'

/**
 * Panel otwiera się przez CSS (:hover/:focus-within na rodzicu w Header) —
 * bez JS: działa też z klawiatury (Tab wchodzi w linki -> focus-within).
 */
export const MegaMenu = () => (
  // Klasa `mega-menu-panel` (globalna, nie z modułu CSS) to hak, po którym
  // Header.module.css otwiera ten panel przez :hover/:focus-within na
  // rodzicu — dwa różne moduły CSS nie widzą nawzajem swoich hashowanych
  // nazw klas.
  <div className={`${styles.panel} mega-menu-panel`}>
    <ul className={styles.grid}>
      {solutions.map((solution) => (
        <li key={solution.id}>
          <Link href={`/rozwiazania#${solution.id}`} className={styles.item}>
            <span className={styles.itemIcon}>
              <SolutionIcon icon={solution.icon} />
            </span>
            <span>
              <span className={styles.itemLabel}>{solution.label}</span>
              <span className={styles.itemDesc}>{solution.description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>

    <div className={styles.feature}>
      <span className={styles.featureEyebrow}>Nie wiesz od czego zacząć?</span>
      <p>Opowiedz nam o swoim problemie biznesowym — dobierzemy właściwe rozwiązanie.</p>
      <Link href="/kontakt" className="btn btnPrimary">
        Porozmawiajmy
        <span className="btnIcon" aria-hidden="true">
          →
        </span>
      </Link>
    </div>
  </div>
)
