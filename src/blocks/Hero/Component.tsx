import type { Page } from '@/payload-types'

type HeroBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

export const HeroBlockComponent = (props: HeroBlockProps) => {
  const { heading, subheading, ctaLabel, ctaHref, alignment } = props
  return (
    <section data-block="hero" data-align={alignment ?? 'left'}>
      <h1>{heading}</h1>
      {subheading ? <p>{subheading}</p> : null}
      {ctaLabel && ctaHref ? <a href={ctaHref}>{ctaLabel}</a> : null}
    </section>
  )
}
