import type { Metadata } from 'next'

import { Hero } from '@/components/home/Hero'
import { SolutionsSelector } from '@/components/home/SolutionsSelector'
import { Showroom } from '@/components/home/Showroom'
import { ProblemSolution } from '@/components/home/ProblemSolution'
import { Process } from '@/components/home/Process'
import { TechEcosystem } from '@/components/home/TechEcosystem'
import { FinalCta } from '@/components/home/FinalCta'

// Strona główna jest świadomie bespoke (nie generyczny page builder) — patrz
// src/content/home.ts. Treść jest wydzielona do zwykłych obiektów, więc
// przeniesienie jej pod Payload (osobny Global) później nie wymaga zmian
// w komponentach, tylko podmiany źródła danych. Brak odczytów z bazy tutaj
// pozwala w pełni statycznie wyrenderować tę stronę.
export const metadata: Metadata = {
  title: 'Agencja Stron — Cyfrowe rozwiązania, które napędzają Twój biznes',
  description:
    'Projektujemy i tworzymy strony, sklepy, aplikacje i systemy, które rozwiązują realne problemy biznesowe — nie tylko dobrze wyglądają.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <SolutionsSelector />
      <Showroom />
      <ProblemSolution />
      <Process />
      <TechEcosystem />
      <FinalCta />
    </>
  )
}
