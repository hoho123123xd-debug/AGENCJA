import type { CollectionConfig } from 'payload'

import { isAdminOrUp, isEditorOrUp, readPublishedOrStaff } from '@/access/roles'
import { pageBuilderBlocks } from '@/blocks'
import { seoField } from '@/fields/seo'
import { withAuditLog } from '@/hooks/auditLog'
import { slugify } from '@/lib/slugify'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  access: {
    read: readPublishedOrStaff,
    create: isEditorOrUp,
    update: isEditorOrUp,
    delete: isAdminOrUp,
  },
  // Draft/published + historia wersji "za darmo" z Payload — bez własnego
  // pola statusu i bez pisania mechanizmu wersjonowania od zera.
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 20,
  },
  hooks: withAuditLog('pages'),
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Np. "o-nas" (bez ukośników). "home" = strona główna.' },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (value) return slugify(String(value))
            if (siblingData?.title) return slugify(String(siblingData.title))
            return value
          },
        ],
      },
      validate: (value: unknown) => {
        if (!value) return 'Slug jest wymagany.'
        if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(value))) {
          return 'Dozwolone są tylko małe litery, cyfry i myślniki.'
        }
        return true
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: pageBuilderBlocks,
      admin: { description: 'Kontrolowane bloki treści — kolejność decyduje o układzie strony.' },
    },
    seoField,
  ],
  timestamps: true,
}
