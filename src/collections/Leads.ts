import type { CollectionConfig } from 'payload'

import { isAdminOrUp, isEditorOrUp, isStaff } from '@/access/roles'
import { withAuditLog } from '@/hooks/auditLog'

/**
 * WAŻNE: `create` jest ograniczone do personelu (isStaff), czyli generyczny
 * REST endpoint Payload (`/api/leads`) NIE jest publicznie zapisywalny.
 * Jedyną drogą zgłoszenia z formularza publicznego jest
 * `app/api/contact/route.ts`, który waliduje dane (zod), sprawdza rate
 * limit i honeypot, a dopiero potem wywołuje `payload.create` z
 * `overrideAccess: true` po stronie serwera. Dzięki temu mamy pełną
 * kontrolę nad tym, co i jak trafia do bazy z internetu.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
    description: 'Zgłoszenia z formularza kontaktowego.',
  },
  access: {
    // Viewer widzi leady (raportowanie), ale nie może ich zmieniać —
    // ZWERYFIKOWANE w testach RBAC, że `isStaff` na `update` błędnie
    // pozwalało Viewerowi zmieniać status leada; naprawione na isEditorOrUp.
    read: isStaff,
    create: isEditorOrUp,
    update: isEditorOrUp,
    delete: isAdminOrUp,
  },
  hooks: withAuditLog('leads'),
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'phone', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'interestedService',
      type: 'relationship',
      relationTo: 'services',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Nowy', value: 'new' },
        { label: 'Kontakt nawiązany', value: 'contacted' },
        { label: 'Wygrany', value: 'won' },
        { label: 'Przegrany', value: 'lost' },
      ],
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'contact-form',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'ip',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar', description: 'Do celów antyspamowych / bezpieczeństwa.' },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
  timestamps: true,
}
