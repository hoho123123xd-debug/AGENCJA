import type { CollectionConfig } from 'payload'

import { isEditorOrUp } from '@/access/roles'
import { withAuditLog } from '@/hooks/auditLog'

/**
 * Pliki trzymane są w R2 (patrz `r2Storage` plugin w payload.config.ts) —
 * ten collection config opisuje tylko metadane. `crop`/`focalPoint` są
 * wyłączone celowo: wymagają `sharp`, który jest natywnym modułem Node
 * niedostępnym w środowisku Workers (patrz docs/cloudflare-decisions.md).
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isEditorOrUp,
    update: isEditorOrUp,
    delete: isEditorOrUp,
  },
  hooks: withAuditLog('media'),
  upload: {
    crop: false,
    focalPoint: false,
    // Ogranicza typy plików do bezpiecznej, znanej listy — obrazy + PDF.
    // Payload i tak weryfikuje realny MIME (magic bytes), nie tylko
    // deklarowane rozszerzenie/nagłówek Content-Type.
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Tekst alternatywny — wymagany dla dostępności i SEO.' },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  timestamps: true,
}
