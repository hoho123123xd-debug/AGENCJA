import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { leadSchema } from '@/lib/validation/leadSchema'
import { getClientIp, isRateLimited } from '@/lib/rateLimit'

/**
 * JEDYNY publiczny sposób utworzenia Lead-a. Kolekcja `leads` sama w sobie
 * ma `access.create` ograniczone do personelu — ten route handler waliduje
 * (zod), sprawdza honeypot i rate limit, po czym zapisuje z
 * `overrideAccess: true`. Patrz komentarz w src/collections/Leads.ts.
 */
export async function POST(request: NextRequest) {
  let payloadBody: unknown
  try {
    payloadBody = await request.json()
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowy JSON.' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(payloadBody)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Nieprawidłowe dane.', issues: parsed.error.flatten() }, { status: 400 })
  }

  const { website, ...data } = parsed.data

  // Honeypot wypełniony -> traktujemy jako bota. Zwracamy fałszywy sukces,
  // żeby nie zdradzać mechanizmu detekcji.
  if (website) {
    return NextResponse.json({ ok: true })
  }

  const payload = await getPayloadClient()
  const ip = getClientIp(request.headers)

  const limited = await isRateLimited(payload, { ip, windowMs: 15 * 60 * 1000, max: 5 })
  if (limited) {
    return NextResponse.json({ error: 'Zbyt wiele zgłoszeń. Spróbuj ponownie później.' }, { status: 429 })
  }

  try {
    await payload.create({
      collection: 'leads',
      overrideAccess: true,
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        company: data.company || undefined,
        message: data.message,
        // D1/SQLite używa numerycznych ID (inaczej niż ObjectId w Mongo).
        interestedService: data.interestedService ? Number(data.interestedService) : undefined,
        source: 'contact-form',
        ip,
        userAgent: request.headers.get('user-agent') ?? undefined,
      },
    })
  } catch (err) {
    payload.logger.error({ err }, 'Nie udało się zapisać zgłoszenia z formularza kontaktowego')
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
