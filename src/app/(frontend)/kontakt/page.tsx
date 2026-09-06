import type { Metadata } from 'next'

import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Opowiedz nam o swoim problemie biznesowym — wspólnie zaprojektujemy rozwiązanie.',
}

export default function ContactPage() {
  return (
    <section className="placeholder">
      <h1>Kontakt</h1>
      <ContactForm />
    </section>
  )
}
