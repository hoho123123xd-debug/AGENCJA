import type { Block } from 'payload'

import { HeroBlock } from './Hero/config'
import { RichTextBlock } from './RichText/config'
import { ServicesBlock } from './ServicesBlock/config'
import { CaseStudiesBlock } from './CaseStudiesBlock/config'
import { TestimonialsBlock } from './TestimonialsBlock/config'
import { FAQBlock } from './FAQ/config'
import { CTABlock } from './CTA/config'

/**
 * Skończony zestaw kontrolowanych bloków page-buildera. Celowo NIE ma tu
 * bloku "dowolny HTML/embed" — dodanie nowego typu treści wymaga nowego
 * bloku (review + kod), więc panel nie pozwoli rozjechać design systemu.
 */
export const pageBuilderBlocks: Block[] = [
  HeroBlock,
  RichTextBlock,
  ServicesBlock,
  CaseStudiesBlock,
  TestimonialsBlock,
  FAQBlock,
  CTABlock,
]
