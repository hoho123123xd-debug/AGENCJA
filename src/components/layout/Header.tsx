'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { MegaMenu } from './MegaMenu'
import styles from './Header.module.css'

const NAV_LINKS = [
  { label: 'Możliwości', href: '/#showroom' },
  { label: 'Proces', href: '/proces' },
  { label: 'Technologie', href: '/technologie' },
  { label: 'O nas', href: '/o-nas' },
  { label: 'Blog', href: '/blog' },
]

export const Header = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path
                d="M16 2 29 27H3L16 2Z"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinejoin="round"
                fill="none"
              />
              <path d="M16 13 22 27H10L16 13Z" fill="currentColor" />
            </svg>
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Agencja Stron</span>
            <span className={styles.brandTag}>Pomysł. Technologia. Rezultat.</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Główna">
          <ul>
            <li className={styles.hasMega}>
              <Link href="/rozwiazania" className={styles.megaTrigger}>
                Rozwiązania
                <span className={styles.chevron} aria-hidden="true">
                  ⌄
                </span>
              </Link>
              <MegaMenu />
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/kontakt" className={`btn btnPrimary ${styles.cta}`}>
          Skontaktuj się
          <span className="btnIcon" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </header>
  )
}
