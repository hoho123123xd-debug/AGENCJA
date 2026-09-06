import type { Block } from 'payload'

export const ServicesBlock: Block = {
  slug: 'servicesBlock',
  labels: { singular: 'Usługi', plural: 'Bloki usług' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Puste = pokaż wszystkie aktywne usługi, w kolejności ustawionej w kolekcji Services.' },
    },
  ],
}
