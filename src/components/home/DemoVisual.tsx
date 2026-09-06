import type { Demo } from '@/content/home'
import styles from './Showroom.module.css'

/**
 * Placeholder-wizualizacja per typ demo. Struktura celowo prosta i
 * odizolowana w jednym komponencie — docelowo każdy `case` można
 * podmienić na prawdziwe, interaktywne demo (iframe / embed / live preview)
 * bez zmiany reszty sekcji Showroom.
 */
export const DemoVisual = ({ id }: { id: Demo['id'] }) => {
  switch (id) {
    case 'website':
      return (
        <div className={styles.visWebsite}>
          <div className={styles.visWebsiteHero} />
          <div className={styles.visWebsiteRow}>
            <span />
            <span />
            <span />
          </div>
        </div>
      )
    case 'ecommerce':
      return (
        <div className={styles.visShop}>
          <div className={styles.visShopGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.visShopItem} />
            ))}
          </div>
          <div className={styles.visShopCart}>
            <span className={styles.visShopCartTitle} />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className={styles.visShopCartRow}>
                <span className={styles.visShopCartThumb} />
                <span className={styles.visShopCartLine} />
              </div>
            ))}
            <span className={`btn btnPrimary ${styles.visShopCartBtn}`}>Przejdź do kasy</span>
          </div>
        </div>
      )
    case 'cms':
      return (
        <div className={styles.visCms}>
          {['Hero', 'Usługi', 'Case studies', 'FAQ'].map((block, index) => (
            <div key={block} className={styles.visCmsBlock} style={{ opacity: 1 - index * 0.12 }}>
              <span className={styles.visCmsHandle} aria-hidden="true">
                ⠿
              </span>
              <span>{block}</span>
              <span className={styles.visCmsTag}>blok</span>
            </div>
          ))}
        </div>
      )
    case 'admin':
      return (
        <div className={styles.visAdmin}>
          <div className={styles.visAdminSide}>
            {['Pulpit', 'Strony', 'Leady', 'Ustawienia'].map((label, i) => (
              <span key={label} className={i === 1 ? styles.visAdminSideActive : ''}>
                {label}
              </span>
            ))}
          </div>
          <div className={styles.visAdminTable}>
            <div className={styles.visAdminTableHead}>
              <span />
              <span />
              <span />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.visAdminTableRow}>
                <span />
                <span />
                <span />
              </div>
            ))}
          </div>
        </div>
      )
    case 'business-app':
    default:
      return (
        <div className={styles.visKanban}>
          {['Nowe', 'W toku', 'Gotowe'].map((col, colIndex) => (
            <div key={col} className={styles.visKanbanCol}>
              <span className={styles.visKanbanColTitle}>{col}</span>
              {Array.from({ length: colIndex === 1 ? 3 : 2 }).map((_, i) => (
                <div key={i} className={styles.visKanbanCard} />
              ))}
            </div>
          ))}
        </div>
      )
  }
}
