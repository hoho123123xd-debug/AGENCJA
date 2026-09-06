import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { isAdminOrUp, isEditorOrUp } from '@/access/roles'
import { withAuditLog } from '@/hooks/auditLog'
import { slugify } from '@/lib/slugify'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'active', 'order'],
  },
  access: {
    read: ({ req }) => (req.user ? true : { active: { equals: true } }),
    create: isEditorOrUp,
    update: isEditorOrUp,
    delete: isAdminOrUp,
  },
  hooks: withAuditLog('services'),
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => (value ? slugify(String(value)) : slugify(String(siblingData?.title ?? ''))),
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Strony internetowe', value: 'website' },
        { label: 'Sklepy internetowe', value: 'ecommerce' },
        { label: 'Aplikacje firmowe', value: 'app' },
        { label: 'Systemy dedykowane', value: 'dedicated-system' },
        { label: 'Automatyzacje', value: 'automation' },
        { label: 'Integracje', value: 'integration' },
        { label: 'Inne', value: 'other' },
      ],
    },
    { name: 'summary', type: 'textarea', required: true, maxLength: 200 },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) =>
          defaultFeatures.filter((feature) => !['upload', 'relationship'].includes(feature.key)),
      }),
    },
    { name: 'icon', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
  timestamps: true,
}
