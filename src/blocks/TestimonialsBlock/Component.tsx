import type { Page, Testimonial } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'

type TestimonialsBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'testimonialsBlock' }>

export const TestimonialsBlockComponent = async ({ heading, testimonials }: TestimonialsBlockProps) => {
  let items: Testimonial[] = (testimonials ?? []).filter((t): t is Testimonial => typeof t === 'object')

  if (items.length === 0) {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'testimonials',
      where: { active: { equals: true } },
      limit: 20,
    })
    items = result.docs
  }

  return (
    <section data-block="testimonialsBlock">
      {heading ? <h2>{heading}</h2> : null}
      <ul>
        {items.map((testimonial) => (
          <li key={testimonial.id}>
            <blockquote>{testimonial.quote}</blockquote>
            <cite>
              {testimonial.authorName}
              {testimonial.company ? `, ${testimonial.company}` : ''}
            </cite>
          </li>
        ))}
      </ul>
    </section>
  )
}
