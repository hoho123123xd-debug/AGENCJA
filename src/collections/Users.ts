import type { Access, CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { ROLES, fieldIsOwner, isAdminOrUp } from '@/access/roles'
import { withAuditLog } from '@/hooks/auditLog'

/** Właściciel konta może zawsze zarządzać sobą; inne wiersze — tylko admin+. */
const isSelfOrAdmin: Access = ({ req, id }) => {
  if (!req.user) return false
  const rankIsAdmin = isAdminOrUp({ req } as Parameters<Access>[0])
  if (rankIsAdmin === true) return true
  if (id !== undefined) return req.user.id === id
  return { id: { equals: req.user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Blokada po nieudanych próbach — ochrona przed brute-force logowania.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minut
    // Sesje w httpOnly cookie (domyślne zachowanie Payload) zamiast JWT
    // trzymanego po stronie klienta — ogranicza ryzyko kradzieży tokenu
    // przez XSS. `secure` wymusza HTTPS poza lokalnym developmentem.
    cookies: {
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
    },
    tokenExpiration: 60 * 60 * 8, // 8h
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'updatedAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: isAdminOrUp,
    update: isSelfOrAdmin,
    delete: isAdminOrUp,
    admin: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      async ({ operation, data, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          // Pierwsze konto w systemie zawsze zostaje Ownerem — niezależnie
          // od tego, co przyszło w polu `role` (formularz "create first
          // user" działa bez zalogowanego użytkownika, więc nie możemy
          // polegać na access control pola w tym jednym przypadku).
          if (totalDocs === 0) {
            data.role = 'owner'
          } else if (!data.role) {
            data.role = 'viewer'
          }
        }
        return data
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const doc = await req.payload.findByID({ collection: 'users', id, req })
        if (doc?.role === 'owner') {
          const { totalDocs } = await req.payload.count({
            collection: 'users',
            where: { role: { equals: 'owner' } },
            req,
          })
          if (totalDocs <= 1) {
            throw new APIError('Nie można usunąć jedynego konta z rolą Owner.', 400)
          }
        }
      },
    ],
    afterChange: withAuditLog('users').afterChange,
    afterDelete: withAuditLog('users').afterDelete,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      options: ROLES.map((value) => ({ label: value, value })),
      access: {
        // Tylko Owner nadaje/zmienia role — admin nie może się awansować
        // ani awansować innych do rangi wyższej niż jego własna.
        update: fieldIsOwner,
      },
      admin: {
        description: 'Owner: pełna kontrola. Admin: treść/leady/ustawienia. Editor: treść. Viewer: odczyt.',
      },
    },
  ],
  timestamps: true,
}
