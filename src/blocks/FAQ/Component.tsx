import type { Page } from '@/payload-types'

type FAQBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'faq' }>

export const FAQBlockComponent = ({ heading, items }: FAQBlockProps) => (
  <section data-block="faq">
    {heading ? <h2>{heading}</h2> : null}
    <dl>
      {(items ?? []).map((item, index) => (
        <div key={index}>
          <dt>{item.question}</dt>
          <dd>{item.answer}</dd>
        </div>
      ))}
    </dl>
  </section>
)
