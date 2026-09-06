import type { Block } from 'payload'

export const CaseStudiesBlock: Block = {
  slug: 'caseStudiesBlock',
  labels: { singular: 'Case studies', plural: 'Bloki case studies' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'caseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      admin: { description: 'Puste = pokaż najnowsze opublikowane case studies.' },
    },
  ],
}
