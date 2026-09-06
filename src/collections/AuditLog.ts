import type { CollectionConfig } from 'payload'

import { denyAll, isAdminOrUp } from '@/access/roles'

/**
 * Append-only log istotnych operacji administracyjnych. Nic — łącznie z
 * Ownerem przez API — nie może edytować ani kasować wpisów; jedyny zapis
 * odbywa się programowo z hooków w `src/hooks/auditLog.ts`, więc `create`
 * jest zablokowany na poziomie access control i wpisy trafiają tu przez
 * `payload.create` wywoływane z `overrideAccess: true`.
 */
export const AuditLog: CollectionConfig = {
  slug: 'audit-log',
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'collectionSlug', 'operation', 'performedBy', 'createdAt'],
    description: 'Niemutowalny log operacji administracyjnych. Tylko do odczytu.',
  },
  access: {
    read: isAdminOrUp,
    create: denyAll,
    update: denyAll,
    delete: denyAll,
  },
  fields: [
    {
      name: 'summary',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'collectionSlug',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'operation',
      type: 'select',
      required: true,
      options: ['create', 'update', 'delete'],
      admin: { readOnly: true },
    },
    {
      name: 'performedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
    {
      name: 'performedByEmail',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Zdenormalizowany email — czytelny nawet po usunięciu konta.',
      },
    },
    {
      name: 'before',
      type: 'json',
      admin: { readOnly: true, description: 'Stan dokumentu przed zmianą (update/delete).' },
    },
    {
      name: 'after',
      type: 'json',
      admin: { readOnly: true, description: 'Stan dokumentu po zmianie (create/update).' },
    },
  ],
  timestamps: true,
}
