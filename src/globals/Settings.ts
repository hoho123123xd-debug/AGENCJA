import type { GlobalConfig } from 'payload'

import { isAdminOrUp } from '@/access/roles'

export const Settings: GlobalConfig = {
  slug: 'settings',
  admin: { description: 'Ustawienia globalne strony: SEO domyślne, nawigacja, stopka, analityka.' },
  access: {
    read: () => true,
    update: isAdminOrUp,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const performedByEmail =
          req.user && typeof req.user === 'object' && 'email' in req.user
            ? String((req.user as { email?: unknown }).email ?? '')
            : 'system'
        await req.payload.create({
          collection: 'audit-log',
          overrideAccess: true,
          req,
          data: {
            summary: `update settings przez ${performedByEmail}`,
            collectionSlug: 'settings',
            documentId: 'settings',
            operation: 'update',
            performedBy: req.user?.id ?? null,
            performedByEmail,
            before: previousDoc,
            after: doc,
          },
        })
      },
    ],
  },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'Agencja' },
    { name: 'contactEmail', type: 'email' },
    {
      name: 'defaultSeo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', maxLength: 70 },
        { name: 'description', type: 'textarea', maxLength: 160 },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'navigation',
      type: 'array',
      labels: { singular: 'Pozycja menu', plural: 'Menu' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['linkedin', 'facebook', 'instagram', 'x', 'github', 'youtube'],
          required: true,
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'footerText', type: 'textarea' },
    {
      name: 'analytics',
      type: 'group',
      admin: { description: 'Identyfikatory narzędzi analitycznych — ładowane po stronie klienta tylko po zgodzie.' },
      fields: [
        { name: 'consentRequired', type: 'checkbox', defaultValue: true },
        { name: 'plausibleDomain', type: 'text' },
        { name: 'gaMeasurementId', type: 'text' },
      ],
    },
    {
      name: 'featureFlags',
      type: 'group',
      fields: [
        { name: 'maintenanceMode', type: 'checkbox', defaultValue: false },
        { name: 'showBlog', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
