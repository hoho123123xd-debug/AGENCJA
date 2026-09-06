import type { Page, Service } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'

type ServicesBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'servicesBlock' }>

export const ServicesBlockComponent = async ({ heading, intro, services }: ServicesBlockProps) => {
  let items: Service[] = (services ?? []).filter((s): s is Service => typeof s === 'object')

  if (items.length === 0) {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'services',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 50,
    })
    items = result.docs
  }

  return (
    <section data-block="servicesBlock">
      {heading ? <h2>{heading}</h2> : null}
      {intro ? <p>{intro}</p> : null}
      <ul>
        {items.map((service) => (
          <li key={service.id}>
            <h3>{service.title}</h3>
            <p>{service.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
