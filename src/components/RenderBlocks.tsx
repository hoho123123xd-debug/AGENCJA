import type { Page } from '@/payload-types'

import { HeroBlockComponent } from '@/blocks/Hero/Component'
import { RichTextBlockComponent } from '@/blocks/RichText/Component'
import { ServicesBlockComponent } from '@/blocks/ServicesBlock/Component'
import { CaseStudiesBlockComponent } from '@/blocks/CaseStudiesBlock/Component'
import { TestimonialsBlockComponent } from '@/blocks/TestimonialsBlock/Component'
import { FAQBlockComponent } from '@/blocks/FAQ/Component'
import { CTABlockComponent } from '@/blocks/CTA/Component'

type LayoutBlock = NonNullable<Page['layout']>[number]

/**
 * Jedyne miejsce, w którym `blockType` z panelu admina jest mapowany na
 * konkretny, kontrolowany komponent React. Dodanie nowego typu bloku
 * wymaga wpisu tutaj + w `src/blocks/index.ts` (config) — świadoma decyzja
 * w kodzie, nie coś, co edytor może zrobić z panelu.
 */
export const RenderBlocks = ({ blocks }: { blocks: LayoutBlock[] | null | undefined }) => {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlockComponent key={block.id ?? index} {...block} />
          case 'richText':
            return <RichTextBlockComponent key={block.id ?? index} {...block} />
          case 'servicesBlock':
            return <ServicesBlockComponent key={block.id ?? index} {...block} />
          case 'caseStudiesBlock':
            return <CaseStudiesBlockComponent key={block.id ?? index} {...block} />
          case 'testimonialsBlock':
            return <TestimonialsBlockComponent key={block.id ?? index} {...block} />
          case 'faq':
            return <FAQBlockComponent key={block.id ?? index} {...block} />
          case 'cta':
            return <CTABlockComponent key={block.id ?? index} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
