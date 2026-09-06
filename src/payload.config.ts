import fs from 'fs'
import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Services } from './collections/Services'
import { CaseStudies } from './collections/CaseStudies'
import { Testimonials } from './collections/Testimonials'
import { Leads } from './collections/Leads'
import { AuditLog } from './collections/AuditLog'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined)

const isCLI = process.argv.some((value) => realpath(value)?.endsWith(path.join('payload', 'bin.js')))
const isProduction = process.env.NODE_ENV === 'production'
const serverURL = process.env.SERVER_URL || 'http://localhost:3000'

// Payload's default logger (pino-pretty) shells out to `fs.write`, które
// nie istnieje w Workers ("fs.write is not implemented"). W produkcji
// zastępujemy je logerem opartym wyłącznie o console.*, zgodnie z
// oficjalnym szablonem Cloudflare od Payload.
const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }))
    }
  }

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
} as any // eslint-disable-line @typescript-eslint/no-explicit-any -- PayloadLogger type nie jest jeszcze eksportowany

// ZWERYFIKOWANE empirycznie (próba `next build` z oryginalną logiką
// szablonu `isCLI || !isProduction`): `next build` wymusza wewnętrznie
// NODE_ENV=production, więc ta gałąź próbowała użyć `getCloudflareContext`
// (przeznaczonego wyłącznie dla kodu faktycznie wykonywanego W WORKERD) już
// na etapie builda na zwykłym Node — kończyło się to próbą nawiązania
// zdalnego połączenia z Cloudflare i błędem braku CLOUDFLARE_API_TOKEN.
// Poprawny sygnał to sprawdzenie, czy kod NAPRAWDĘ działa w workerd
// (oficjalna, udokumentowana metoda Cloudflare: `navigator.userAgent`).
const isRunningInWorkerd = typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers'

const cloudflare = isRunningInWorkerd
  ? await getCloudflareContext({ async: true })
  : await getCloudflareContextFromWrangler()

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages, Services, CaseStudies, Testimonials, Leads, AuditLog],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL,
  // Jawna allowlista originów — brak "*". Frontend i admin żyją pod tą
  // samą domeną (jedna aplikacja Next.js na Workers), więc lista ma
  // docelowo jeden wpis produkcyjny + adres(y) developerskie.
  cors: [serverURL],
  csrf: [serverURL],
  // GraphQL wyłączone: (1) nie jest nam potrzebne — frontend czyta dane
  // przez Local API/REST, (2) na dzień pisania tej konfiguracji Cloudflare
  // Workers ma niewyjaśniony błąd upstream z GraphQL na workerd
  // (github.com/cloudflare/workerd/issues/5175), (3) mniejszy bundle Workera
  // pomaga zmieścić się w limicie rozmiaru.
  graphQL: {
    disable: true,
  },
  // UWAGA: wcześniejsze wersje Payload miały top-level opcję `rateLimit`
  // w buildConfig — ZWERYFIKOWANE (typecheck + rozpakowanie paczki), że
  // NIE istnieje ona w Config na 3.82.1 ani w najnowszej opublikowanej
  // 3.88.0. Globalny rate limiting API realizujemy więc na poziomie
  // Cloudflare (reguła WAF/Rate Limiting na strefie — decyzja/konfiguracja
  // po stronie konta, patrz docs/cloudflare-decisions.md), a punktowy
  // throttling formularza kontaktowego — w src/lib/rateLimit.ts (D1).
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  logger: isProduction ? cloudflareLogger : undefined,
  // ZWERYFIKOWANE (typecheck + rozpakowanie paczki): `r2Storage(...)` zwraca
  // zwykły `Plugin` i rejestruje się przez `plugins`, NIE przez dedykowany
  // klucz `storage` — mimo że tak wygląda to w źródle szablonu na GitHub
  // main. Config type instalowanego 3.82.1 (i najnowszego opublikowanego
  // 3.88.0) nie ma pola `storage`; szablon na GitHub jest w tym miejscu
  // niespójny z tym, co faktycznie opublikowano na npm.
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
})

// Zaadaptowane z:
// https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/src/api/cloudflare-context.ts
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(({ getPlatformProxy }) =>
    getPlatformProxy({
      environment: process.env.CLOUDFLARE_ENV,
      // Zdalne bindingi (prawdziwa produkcyjna D1/R2 z tej maszyny) tylko
      // dla faktycznego kroku `payload migrate` uruchamianego z
      // `deploy:database` (isCLI && isProduction) — NIGDY podczas
      // `next build`/`next dev`, które mają być w pełni lokalne/offline.
      remoteBindings: isCLI && isProduction,
    } satisfies GetPlatformProxyOptions),
  )
}
