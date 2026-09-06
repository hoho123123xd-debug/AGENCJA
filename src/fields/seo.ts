import type { Field } from 'payload'

/** Współdzielona grupa pól SEO — dokładana do każdego typu treści routowanej. */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  admin: {
    description: 'Metadane wyszukiwarek i social media dla tej strony.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      maxLength: 70,
      admin: { description: 'Meta title. Jeśli puste, użyty zostanie tytuł strony.' },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 160,
      admin: { description: 'Meta description (do ~160 znaków).' },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Obraz Open Graph / Twitter Card.' },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      admin: { description: 'Nadpisuje domyślny canonical URL (rzadko potrzebne).' },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Zablokuj indeksowanie tej strony przez wyszukiwarki.' },
    },
  ],
}
