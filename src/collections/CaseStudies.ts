import type { CollectionConfig } from 'payload'

import { isAdminOrUp, isEditorOrUp, readPublishedOrStaff } from '@/access/roles'
import { seoField } from '@/fields/seo'
import { withAuditLog } from '@/hooks/auditLog'
import { slugify } from '@/lib/slugify'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', '_status', 'updatedAt'],
  },
  access: {
    read: readPublishedOrStaff,
    create: isEditorOrUp,
    update: isEditorOrUp,
    delete: isAdminOrUp,
  },
  versions: { drafts: { autosave: false }, maxPerDoc: 20 },
  hooks: withAuditLog('case-studies'),
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
    { name: 'client', type: 'text', required: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'summary', type: 'textarea', required: true, maxLength: 200 },
    { name: 'problem', type: 'textarea', required: true },
    { name: 'solution', type: 'textarea', required: true },
    {
      name: 'results',
      type: 'array',
      labels: { singular: 'Rezultat', plural: 'Rezultaty' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    { name: 'publishedDate', type: 'date', admin: { position: 'sidebar' } },
    seoField,
  ],
  timestamps: true,
}
