import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Nagłówki bezpieczeństwa stosowane na poziomie aplikacji (defense-in-depth
 * niezależny od ustawień strefy Cloudflare — patrz docs/cloudflare-decisions.md
 * odnośnie WAF/HSTS na brzegu sieci).
 *
 * Panel admina Payload (React SPA + edytor JSON/kod) potrzebuje
 * `unsafe-inline`/`unsafe-eval` — to świadomy, udokumentowany kompromis;
 * publiczna część strony dostaje w pełni restrykcyjny CSP z nonce.
 */
const BASE_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}

const ADMIN_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'none'",
].join('; ')

const publicCsp = (nonce: string) =>
  [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    // `unsafe-inline` TYLKO dla style-src, świadomie: sekcje strony pozycjonują
    // elementy (chaos words, węzły procesu, orbit technologii, tilt hero pod
    // kursorem) przez inline `style`/`element.style.setProperty`, a CSP nie ma
    // mechanizmu nonce dla atrybutu `style` (tylko dla tagów <style>/<script>).
    // script-src zostaje w pełni restrykcyjny (nonce, bez unsafe-inline/eval) —
    // to on jest realnym wektorem XSS, nie inline style.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ')

export function proxy(request: NextRequest) {
  const isAdminOrApi = request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api')

  const nonce = isAdminOrApi ? undefined : crypto.randomUUID()
  const requestHeaders = new Headers(request.headers)
  if (nonce) requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({ request: { headers: requestHeaders } })

  for (const [key, value] of Object.entries(BASE_HEADERS)) {
    response.headers.set(key, value)
  }
  response.headers.set('Content-Security-Policy', isAdminOrApi ? ADMIN_CSP : publicCsp(nonce!))

  return response
}

export const config = {
  matcher: [
    // Wszystko poza plikami statycznymi Next.js / assetami.
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
