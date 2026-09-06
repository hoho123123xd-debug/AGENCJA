import Link from 'next/link'

import styles from './Footer.module.css'

const FOOTER_LINKS = [
  { label: 'Rozwiązania', href: '/rozwiazania' },
  { label: 'Możliwości', href: '/#showroom' },
  { label: 'Proces', href: '/proces' },
  { label: 'Technologie', href: '/technologie' },
  { label: 'O nas', href: '/o-nas' },
  { label: 'Blog', href: '/blog' },
]

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
]

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={`container ${styles.top}`}>
      <div className={styles.brandCol}>
        <span className={styles.brandName}>Agencja Stron</span>
        <span className={styles.brandTag}>Pomysł. Technologia. Rezultat.</span>
      </div>

      <nav className={styles.nav} aria-label="Stopka">
        <ul>
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link href="/kontakt" className={`btn btnSecondary ${styles.cta}`}>
        Skontaktuj się
        <span className="btnIcon" aria-hidden="true">
          →
        </span>
      </Link>
    </div>

    <div className={`container ${styles.bottom}`}>
      <p className={styles.copy}>© {new Date().getFullYear()} Agencja Stron. Wszelkie prawa zastrzeżone.</p>

      <ul className={styles.socials}>
        {SOCIALS.map((social) => (
          <li key={social.href}>
            <a href={social.href} target="_blank" rel="noopener noreferrer">
              {social.label}
            </a>
          </li>
        ))}
      </ul>

      <ul className={styles.legal}>
        <li>
          <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
        </li>
        <li>
          <Link href="/regulamin">Regulamin</Link>
        </li>
      </ul>
    </div>
  </footer>
)
