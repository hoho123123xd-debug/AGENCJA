import type { Access, FieldAccess } from 'payload'

/**
 * Role są uporządkowane hierarchicznie: wyższa ranga zawiera uprawnienia
 * niższych. Owner = pełna kontrola (jedyna rola zarządzająca kontami),
 * Admin = zarządza treścią/leadami/ustawieniami, Editor = tworzy/edytuje
 * treść, Viewer = wyłącznie odczyt (np. raportowanie).
 */
export const ROLES = ['owner', 'admin', 'editor', 'viewer'] as const
export type Role = (typeof ROLES)[number]

const ROLE_RANK: Record<Role, number> = {
  owner: 4,
  admin: 3,
  editor: 2,
  viewer: 1,
}

type AuthedUser = { role?: Role | null } | null | undefined

const rankOf = (user: AuthedUser): number => {
  if (!user?.role) return 0
  return ROLE_RANK[user.role] ?? 0
}

const atLeast =
  (min: Role): Access =>
  ({ req }) =>
    rankOf(req.user as AuthedUser) >= ROLE_RANK[min]

const fieldAtLeast =
  (min: Role): FieldAccess =>
  ({ req }) =>
    rankOf(req.user as AuthedUser) >= ROLE_RANK[min]

/** Tylko zalogowany personel (dowolna rola) — brak dostępu publicznego. */
export const isStaff: Access = ({ req }) => Boolean(req.user)

export const isOwner = atLeast('owner')
export const isAdminOrUp = atLeast('admin')
export const isEditorOrUp = atLeast('editor')
export const isViewerOrUp = atLeast('viewer')

export const fieldIsAdminOrUp = fieldAtLeast('admin')
export const fieldIsOwner = fieldAtLeast('owner')

/**
 * Odczyt publiczny tylko opublikowanych dokumentów; personel (editor+)
 * widzi też szkice/wersje robocze. Zwracany obiekt to ograniczenie
 * zapytania (Payload/D1 przefiltruje wynik), nie prosty boolean.
 */
export const readPublishedOrStaff: Access = ({ req }) => {
  if (rankOf(req.user as AuthedUser) >= ROLE_RANK.editor) return true
  return {
    // `_status` jest dodawane automatycznie przez Payload przy
    // `versions.drafts` (draft/published) — patrz kolekcja Pages.
    _status: {
      equals: 'published',
    },
  }
}

export const denyAll: Access = () => false
