import type { Metadata } from 'next'

import { TechEcosystem } from '@/components/home/TechEcosystem'
import { FinalCta } from '@/components/home/FinalCta'

export const metadata: Metadata = {
  title: 'Technologie — Agencja Stron',
  description: 'React, Next.js, TypeScript, Node.js, Python, PostgreSQL, Cloudflare, Shopify, Docker, Figma.',
}

export default function TechnologiePage() {
  return (
    <>
      <TechEcosystem />
      <FinalCta />
    </>
  )
}
