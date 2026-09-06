# Agencja — fundament techniczny (Cloudflare-first)

Next.js + Payload CMS na Cloudflare Workers, z D1 (baza) i R2 (media). Ten dokument opisuje **fundament**, nie finalny wygląd strony — patrz `docs/cloudflare-decisions.md` dla pełnego uzasadnienia decyzji technicznych i znanych ograniczeń.

## Stack (dokładne, zweryfikowane wersje)

| Zależność | Wersja | Uwaga |
|---|---|---|
| next | 16.3.3 | build wymaga `--webpack` (patrz niżej) |
| payload | 3.82.1 | lockstep ze wszystkimi `@payloadcms/*` |
| @payloadcms/db-d1-sqlite | 3.82.1 | adapter D1 |
| @payloadcms/storage-r2 | 3.82.1 | adapter R2 (rejestrowany przez `plugins`, nie `storage`) |
| @payloadcms/next, /ui, /richtext-lexical | 3.82.1 | |
| @opennextjs/cloudflare | ^1.11.0 (rozwiązuje się do 1.20.x) | adapter Next→Workers |
| wrangler | ~4.129.0 | |
| drizzle-kit | 0.31.7 | bezpośrednia devDependency — wymagane, żeby externalizacja działała pod Turbopackiem (patrz niżej) |
| react / react-dom | 19.2.6 | |
| zod | ^3.24 | walidacja server-side |
| node | ≥22.12 (zweryfikowane), oficjalnie zalecane ≥24.15 | patrz „Znane ograniczenia” |

Bazą był oficjalny szablon `payloadcms/payload/templates/with-cloudflare-d1` — **nie** eksperymentalny `vinext` (Cloudflare, wciąż niestabilny dla realnych aplikacji). Podczas integracji znaleziono i naprawiono kilka miejsc, w których ten szablon jest niespójny z tym, co faktycznie opublikowano na npm — pełna lista w `docs/cloudflare-decisions.md`.

## Struktura projektu

```
src/
├── access/roles.ts          # RBAC: owner/admin/editor/viewer + helpery
├── blocks/                  # Page builder: config (Payload) + Component (React) per blok
│   ├── Hero/ RichText/ ServicesBlock/ CaseStudiesBlock/
│   ├── TestimonialsBlock/ FAQ/ CTA/
│   └── index.ts             # rejestr kontrolowanych bloków
├── collections/              # Users, Media, Pages, Services, CaseStudies,
│                              # Testimonials, Leads, AuditLog
├── globals/Settings.ts
├── fields/seo.ts             # współdzielona grupa pól SEO
├── hooks/auditLog.ts         # audit log jako hook na kolekcjach
├── lib/                      # payload.ts, seo.ts, slugify.ts, rateLimit.ts,
│                              # validation/leadSchema.ts (zod)
├── components/                # RenderBlocks, ContactForm
├── app/
│   ├── (frontend)/            # strona publiczna — dynamiczne strony wg slug
│   ├── (payload)/              # panel /admin + REST API Payload
│   ├── api/contact/route.ts    # JEDYNY publiczny sposób utworzenia Lead-a
│   ├── sitemap.ts, robots.ts
│   └── proxy.ts                # nagłówki bezpieczeństwa / CSP (Next.js 16: proxy, nie middleware)
wrangler.jsonc                  # bindings D1/R2, środowiska production/staging
open-next.config.ts
docs/cloudflare-decisions.md    # pełne uzasadnienie + znane ograniczenia
```

## Model danych (D1)

- **users** — auth, pole `role` (owner/admin/editor/viewer), lockout po 5 nieudanych logowaniach, sesje w httpOnly+SameSite=Strict cookie.
- **media** — upload do R2, `alt` wymagany, `crop`/`focalPoint` wyłączone (brak `sharp` w Workers).
- **pages** — `slug`, `layout` (blocks), `seo` (grupa), `versions.drafts` (status draft/published + historia wersji z Payloada, bez własnego kodu).
- **services**, **case-studies** (z `versions.drafts`), **testimonials**.
- **leads** — zgłoszenia z formularza; `access.create` ograniczony do personelu (patrz niżej).
- **audit-log** — append-only (`create`/`update`/`delete` w API zablokowane), zapisywany wyłącznie z hooków przez `overrideAccess: true`.
- **settings** (global) — SEO domyślne, nawigacja, stopka, social links, analityka, feature flagi.

## Cloudflare — konfiguracja i bindings

`wrangler.jsonc`: Worker `agencja-web` (produkcja) + `env.staging` (`agencja-web-staging`) — osobne D1 i R2 per środowisko. `database_id` i nazwy bucketów w repo to placeholdery `REPLACE_WITH_*_D1_ID` — **wymagają uzupełnienia po Twojej stronie** (`wrangler d1 create`, `wrangler r2 bucket create`).

Compatibility flags: `nodejs_compat`, `global_fetch_strictly_public` (blokuje fetch do prywatnych IP z Workera — dzięki temu `skipSafeFetch` w Media jest bezpieczne).

## Deployment

```bash
pnpm install
pnpm run generate:types           # cloudflare-env.d.ts + payload-types.ts (niecommitowane, generowane)
pnpm wrangler login                 # jednorazowo
wrangler d1 create agencja-web-production   # i wklej database_id do wrangler.jsonc
wrangler r2 bucket create agencja-web-production-media
pnpm run deploy                     # migracje na prawdziwą D1 + build + deploy
# staging:
CLOUDFLARE_ENV=staging pnpm run deploy
```

## Lokalny development

```bash
pnpm install
pnpm run generate:types
cp .env.example .env               # ustaw PAYLOAD_SECRET (openssl rand -hex 32)
pnpm run dev                        # D1/R2 emulowane lokalnie przez Wrangler — bez konta Cloudflare
```

Pierwsze konto (Owner) tworzysz pod `/admin` — pierwszy zarejestrowany użytkownik zawsze dostaje rolę `owner`, niezależnie od tego, co przyjdzie w formularzu (`src/collections/Users.ts`, hook `beforeChange`).

## Zastosowane zabezpieczenia

- RBAC z hierarchią ról + row/field-level access control (m.in. tylko Owner zmienia role; Viewer nie może modyfikować leadów — zweryfikowane w testach, patrz niżej).
- Sesje w httpOnly/SameSite=Strict cookie, nie JWT w localStorage; CSRF wymuszany przez `csrf`/`cors` (allowlist origin) — zweryfikowany empirycznie.
- Walidacja server-side: Payload field validation + zod w `app/api/contact` (jedyna publiczna droga zapisu Leada).
- Rate limiting formularza kontaktowego: throttle po IP oparty o D1 (bez Redis/KV) + honeypot.
- Security headers + CSP przez `proxy.ts` (osobny, bardziej restrykcyjny CSP dla frontu vs panelu admina) + `public/_headers` dla plików statycznych.
- Upload: whitelist MIME, bez przetwarzania obrazów server-side (patrz ograniczenia).
- Audit log: niemutowalny, zapisywany z hooków na wszystkich wrażliwych kolekcjach.
- GraphQL wyłączone (nieużywane + niejednoznaczne wsparcie na workerd).

## Wyniki testów (lokalnie, D1/R2 emulowane przez Wrangler)

- ✅ `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:int` — czysto.
- ✅ `pnpm run build` (Next.js, webpack) i `opennextjs-cloudflare build` — bundle Workera ~2.46 MB gzip / ~9.2 MB surowo (dobrze mieści się nawet w starym limicie 3 MB gzip, tym bardziej w nowym 64 MiB nieskompresowanym — patrz `docs/cloudflare-decisions.md`).
- ✅ Rejestracja pierwszego użytkownika → rola `owner` automatycznie.
- ✅ Login (cookie httpOnly) + `/api/users/me` — działa poprawnie w kontekście przeglądarkowym (zweryfikowane z nagłówkami `Origin`/`Sec-Fetch-Site`, które faktycznie wysyła przeglądarka).
- ✅ RBAC: Owner tworzy Service (200), Viewer — odrzucony (403); Viewer nie może zmieniać leadów (403) — **znaleziono i naprawiono** lukę, gdzie Viewer mógł edytować leady.
- ✅ Upload pliku do Media → zapis i odczyt z lokalnego R2.
- ✅ CRUD na Pages z page-builderem (Hero + CTA) → poprawne renderowanie na stronie głównej.
- ✅ Formularz kontaktowy: happy path, honeypot (cichy sukces bez zapisu), walidacja (błędy PL), rate limit (429 po 5 zgłoszeniach/15 min).
- ✅ Audit log: wpisy tworzone automatycznie przy create/update/delete.
- ✅ Nagłówki bezpieczeństwa i CSP obecne na każdej odpowiedzi (różne dla `/admin` i frontu).

## Znane ograniczenia i decyzje wymagające Twojej akceptacji

Patrz `docs/cloudflare-decisions.md` — pełna, techniczna lista. Skrót najważniejszych:

1. **Brak przetwarzania obrazów server-side** (crop/focalPoint/resizing) — `sharp` nie działa w Workers. Do rozważenia później: Cloudflare Images (płatne) albo Cloudflare Image Resizing przez URL.
2. **Workers Paid ($5/mies.) nadal rekomendowany** — ale NIE z powodu limitu rozmiaru (ten akurat zniesiono 4 września 2026, dosłownie kilka dni temu), tylko limitu **10ms CPU/request na planie Free**, który może być zbyt ciasny dla SSR Next.js + zapytań do D1.
3. **Build wymaga `next build --webpack`**, nie domyślnego Turbopacka — pod Turbopackiem `serverExternalPackages` nie externalizuje poprawnie zależności tranzytywnych (`drizzle-kit`), co wywala bundling OpenNext. Zweryfikowane empirycznie.
4. **Globalny `rateLimit` z buildConfig nie istnieje** w tej (ani najnowszej) wersji Payload, mimo że sugerowała to dokumentacja — globalny rate limiting trzeba skonfigurować na poziomie strefy Cloudflare (reguła WAF/Rate Limiting w dashboardzie — poza zakresem tego, co wdraża repo).
5. **GraphQL wyłączone** — nieużywane przez nas + niepewne wsparcie na workerd (upstream issue w `workerd`).
6. **Cache/ISR** — strony renderowane dynamicznie (`force-dynamic`), czytają D1 przy każdym żądaniu zamiast pełnego SSG/ISR. Punkt rozszerzenia: R2-backed incremental cache (binding `NEXT_INC_CACHE_R2_BUCKET`, już zakomentowany w `wrangler.jsonc`).
7. **`database_id`/nazwy bucketów w `wrangler.jsonc` to placeholdery** — wymagają uzupełnienia po utworzeniu realnych zasobów na Twoim koncie Cloudflare.

Żadna z tych decyzji nie blokuje dalszej pracy nad wyglądem/treścią — to świadomie odłożone punkty rozszerzenia, zgodnie z zasadą „nie komplikuj na start”.
