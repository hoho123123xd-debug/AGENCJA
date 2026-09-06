import type { Metadata } from 'next'

import { Hero } from '@/components/home/Hero'
import { Showroom } from '@/components/home/Showroom'
import { ProblemSolution } from '@/components/home/ProblemSolution'
import { FinalCta } from '@/components/home/FinalCta'

// Strona główna jest świadomie bespoke (nie generyczny page builder) — patrz
// src/content/home.ts. Rozwiązania/Proces/Technologie mają własne, pełne
// podstrony (/rozwiazania, /proces, /technologie) — to jest skrócona,
// "landingowa" wersja, nie one-pager z wszystkim na jednej stronie.
export const metadata: Metadata = {
  title: 'Agencja Stron — Cyfrowe rozwiązania, które napędzają Twój biznes',
  description:
    'Projektujemy i tworzymy strony, sklepy, aplikacje i systemy, które rozwiązują realne problemy biznesowe — nie tylko dobrze wyglądają.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Showroom />
      <ProblemSolution />
      <FinalCta />
    </>
  )
}
