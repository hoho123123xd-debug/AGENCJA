import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'Bloki CTA' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', required: true },
    {
      name: 'buttonHref',
      type: 'text',
      required: true,
      validate: (value: unknown) => {
        const v = String(value ?? '')
        if (v.startsWith('/') || /^https:\/\//.test(v)) return true
        return 'Adres musi zaczynać się od "/" lub "https://"'
      },
    },
  ],
}
