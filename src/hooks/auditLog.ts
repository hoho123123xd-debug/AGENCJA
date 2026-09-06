import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const SENSITIVE_KEY_PATTERN = /password|hash|salt|token|secret/i

/** Usuwa pola wrażliwe zanim trafią do (i tak dostępnego tylko adminom) logu. */
const redact = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(redact)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        SENSITIVE_KEY_PATTERN.test(key) ? '[redacted]' : redact(val),
      ]),
    )
  }
  return value
}

const writeAuditEntry = async (params: {
  req: Parameters<CollectionAfterChangeHook>[0]['req']
  collectionSlug: string
  documentId: string | number
  operation: 'create' | 'update' | 'delete'
  before?: unknown
  after?: unknown
}) => {
  const { req, collectionSlug, documentId, operation, before, after } = params
  const performedByEmail =
    req.user && typeof req.user === 'object' && 'email' in req.user
      ? String((req.user as { email?: unknown }).email ?? '')
      : 'system'

  try {
    await req.payload.create({
      collection: 'audit-log',
      // Access control na 'audit-log' blokuje `create` z API — omijamy je
      // celowo, bo to jedyna dozwolona ścieżka zapisu (z serwerowego hooka).
      overrideAccess: true,
      req,
      data: {
        summary: `${operation} ${collectionSlug}#${documentId} przez ${performedByEmail}`,
        collectionSlug,
        documentId: String(documentId),
        operation,
        performedBy: req.user?.id ?? null,
        performedByEmail,
        before: before
          ? (redact(before) as string | number | boolean | Record<string, unknown> | unknown[])
          : undefined,
        after: after
          ? (redact(after) as string | number | boolean | Record<string, unknown> | unknown[])
          : undefined,
      },
    })
  } catch (err) {
    // Log nie może nigdy zablokować właściwej operacji — błąd trafia do
    // konsoli (Workers Logs), a mutacja użytkownika i tak się powiodła.
    req.payload.logger.error({ err, collectionSlug, documentId }, 'Nie udało się zapisać audit-log')
  }
}

/**
 * Podpina audit log pod `afterChange`/`afterDelete` danej kolekcji.
 * Użycie: `hooks: withAuditLog('services')` w konfiguracji kolekcji.
 */
export const withAuditLog = (collectionSlug: string) => ({
  afterChange: [
    (async ({ doc, previousDoc, operation, req }) => {
      if (operation !== 'create' && operation !== 'update') return
      await writeAuditEntry({
        req,
        collectionSlug,
        documentId: doc.id,
        operation,
        before: operation === 'update' ? previousDoc : undefined,
        after: doc,
      })
    }) satisfies CollectionAfterChangeHook,
  ],
  afterDelete: [
    (async ({ doc, id, req }) => {
      await writeAuditEntry({
        req,
        collectionSlug,
        documentId: id,
        operation: 'delete',
        before: doc,
      })
    }) satisfies CollectionAfterDeleteHook,
  ],
})
