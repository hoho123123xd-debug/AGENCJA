import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonialsBlock',
  labels: { singular: 'Opinie', plural: 'Bloki opinii' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: { description: 'Puste = pokaż wszystkie aktywne opinie.' },
    },
  ],
}
