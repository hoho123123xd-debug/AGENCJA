import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev server Next.js domyślnie odrzuca requesty z hostem innym niż
  // localhost (ochrona przed DNS rebinding) — bez tego podgląd w chmurowych
  // IDE (Replit, Codespaces, Gitpod) pokazuje "Blocked request". Dotyczy
  // WYŁĄCZNIE `next dev`, nie ma wpływu na build/produkcję na Cloudflare.
  allowedDevOrigins: ['*.replit.dev', '*.repl.co'],

  images: {
    // Media jest serwowane przez własny endpoint Payload (R2), nie przez
    // zewnętrzne domeny — ogranicza to next/image do zaufanego źródła.
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },

  // Pakiety zawierające kod specyficzny dla Workers (workerd) — muszą być
  // traktowane jako external, inaczej OpenNext źle je zbunduje.
  // https://opennext.js.org/cloudflare/howtos/workerd
  //
  // `drizzle-kit` — ZWERYFIKOWANE (build faktycznie się wywalał): Payload
  // (`withPayload()`) sam próbuje wykluczyć `drizzle-kit`/`drizzle-kit/api`
  // z bundla (patrz komentarz w node_modules/@payloadcms/next/dist/
  // withPayload/withPayload.js), ale z jego WŁASNEGO komentarza wynika, że
  // pod Turbopackiem (domyślny bundler `next build` w Next.js 16, którego
  // tu używamy) `serverExternalPackages` NIE działa dla pakietów
  // tranzytywnych — muszą być zainstalowane bezpośrednio w projekcie, żeby
  // dało się je rozwiązać od jego katalogu głównego. Stąd `drizzle-kit`
  // jest też jawną devDependency w package.json (sam w sobie nieużywany
  // w naszym kodzie — to tylko narzędzie potrzebne @payloadcms/db-d1-sqlite
  // do `payload migrate:create`, nigdy nie jest wykonywane w runtime requestu).
  serverExternalPackages: ['jose', 'drizzle-kit'],

  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
