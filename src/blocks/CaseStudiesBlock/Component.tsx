import type { CaseStudy, Page } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'

type CaseStudiesBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'caseStudiesBlock' }>

export const CaseStudiesBlockComponent = async ({ heading, intro, caseStudies }: CaseStudiesBlockProps) => {
  let items: CaseStudy[] = (caseStudies ?? []).filter((c): c is CaseStudy => typeof c === 'object')

  if (items.length === 0) {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'case-studies',
      sort: '-publishedDate',
      limit: 6,
    })
    items = result.docs
  }

  return (
    <section data-block="caseStudiesBlock">
      {heading ? <h2>{heading}</h2> : null}
      {intro ? <p>{intro}</p> : null}
      <ul>
        {items.map((caseStudy) => (
          <li key={caseStudy.id}>
            <h3>{caseStudy.title}</h3>
            <p>{caseStudy.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
