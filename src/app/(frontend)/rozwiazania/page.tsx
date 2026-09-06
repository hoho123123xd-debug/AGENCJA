import type { Metadata } from 'next'

import { SolutionsSelector } from '@/components/home/SolutionsSelector'
import { FinalCta } from '@/components/home/FinalCta'

export const metadata: Metadata = {
  title: 'Rozwiązania — Agencja Stron',
  description:
    'Strony internetowe, sklepy, aplikacje webowe, systemy dedykowane, automatyzacje i integracje — wybierz kierunek dopasowany do Twojego biznesu.',
}

export default function RozwiazaniaPage() {
  return (
    <>
      <SolutionsSelector />
      <FinalCta />
    </>
  )
}
