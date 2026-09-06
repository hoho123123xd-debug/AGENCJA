import React from 'react'
import './styles.css'

export const metadata = {
  title: 'Agencja',
  description: 'Rozwiązujemy problemy biznesowe klientów poprzez dopasowane rozwiązania cyfrowe.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <a href="#main" className="skip-link">
          Przejdź do treści
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  )
}
