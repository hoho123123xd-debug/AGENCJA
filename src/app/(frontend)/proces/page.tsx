import type { Metadata } from 'next'

import { Process } from '@/components/home/Process'
import { FinalCta } from '@/components/home/FinalCta'

export const metadata: Metadata = {
  title: 'Proces współpracy — Agencja Stron',
  description: 'Od rozmowy i analizy, przez strategię, projekt i development, po wdrożenie i dalszy rozwój.',
}

export default function ProcesPage() {
  return (
    <>
      <Process />
      <FinalCta />
    </>
  )
}
