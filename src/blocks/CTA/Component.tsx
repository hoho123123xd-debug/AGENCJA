import type { Page } from '@/payload-types'

type CTABlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'cta' }>

export const CTABlockComponent = ({ heading, text, buttonLabel, buttonHref }: CTABlockProps) => (
  <section data-block="cta">
    <h2>{heading}</h2>
    {text ? <p>{text}</p> : null}
    <a href={buttonHref}>{buttonLabel}</a>
  </section>
)
