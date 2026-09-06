import type { Payload } from 'payload'

/**
 * Rate limiting bez dodatkowej usługi (Redis/KV) — licznik oparty o D1,
 * który już mamy. To warstwa defense-in-depth; docelową, twardszą barierą
 * ma być reguła Rate Limiting / WAF skonfigurowana na strefie Cloudflare
 * (patrz docs/cloudflare-decisions.md — wymaga decyzji/konfiguracji na
 * koncie Cloudflare, poza zakresem tego, co da się zdeployować z repo).
 */
export const isRateLimited = async (
  payload: Payload,
  params: { ip: string; windowMs: number; max: number },
): Promise<boolean> => {
  if (params.ip === 'unknown') return false // brak IP = nie da się throttlować per-IP

  const since = new Date(Date.now() - params.windowMs).toISOString()
  const { totalDocs } = await payload.count({
    collection: 'leads',
    where: {
      and: [{ ip: { equals: params.ip } }, { createdAt: { greater_than_equal: since } }],
    },
  })

  return totalDocs >= params.max
}

/** Wyciąga adres IP klienta ustawiony przez Cloudflare na brzegu sieci. */
export const getClientIp = (headers: Headers): string =>
  headers.get('cf-connecting-ip') ?? headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
