import type { CollectionConfig } from 'payload'

import { isAdminOrUp, isEditorOrUp } from '@/access/roles'
import { withAuditLog } from '@/hooks/auditLog'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'company', 'active'],
  },
  access: {
    read: ({ req }) => (req.user ? true : { active: { equals: true } }),
    create: isEditorOrUp,
    update: isEditorOrUp,
    delete: isAdminOrUp,
  },
  hooks: withAuditLog('testimonials'),
  fields: [
    { name: 'authorName', type: 'text', required: true },
    { name: 'authorRole', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'quote', type: 'textarea', required: true, maxLength: 500 },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: { description: 'Opcjonalnie, 1–5.' },
    },
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
  timestamps: true,
}
