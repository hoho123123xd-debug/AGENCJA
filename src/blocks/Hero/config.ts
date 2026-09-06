import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    { name: 'media', type: 'upload', relationTo: 'media' },
    { name: 'ctaLabel', type: 'text' },
    {
      name: 'ctaHref',
      type: 'text',
      admin: { description: 'Ścieżka względna (/kontakt) lub pełny adres https://' },
      validate: (value: unknown) => {
        if (!value) return true
        const v = String(value)
        if (v.startsWith('/') || /^https:\/\//.test(v)) return true
        return 'Adres musi zaczynać się od "/" lub "https://"'
      },
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'left',
      options: ['left', 'center'],
    },
  ],
}
