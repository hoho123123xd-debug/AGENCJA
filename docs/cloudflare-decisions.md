# Decyzje techniczne: Cloudflare-first (Next.js + Payload + D1 + R2)

Ten dokument zbiera **wszystko, co zweryfikowano empirycznie** (instalacja, typecheck, build, lokalny deploy, testy funkcjonalne) podczas budowy fundamentu — łącznie z rzeczami, które okazały się inne, niż sugerowała dokumentacja/szablony. Celowo rozdzielone od README, żeby README zostało krótkie i praktyczne.

## 1. Next.js vs vinext — wybór ścieżki deploymentu

Cloudflare promuje obecnie `vinext` (Vite-owa reimplementacja API Next.js) jako kierunek rozwoju dla Workers. Sprawdzone:

- `vinext` pokrywa ~94% API Next.js 16, powstał w tydzień (w dużej mierze wygenerowany przez AI), i **sam siebie opisuje jako niegotowy do zastąpienia każdej aplikacji produkcyjnej** — nie jest tym, na czym Payload testuje swój oficjalny szablon Cloudflare.
- Oficjalny szablon Payload (`payloadcms/payload/templates/with-cloudflare-d1`) używa **`@opennextjs/cloudflare`** — dojrzalszego, współrozwijanego z Cloudflare i Next.js adaptera (Next.js 16.2 ustabilizował swoje "Adapter API" właśnie pod adaptery takie jak ten).
- Decyzja: **@opennextjs/cloudflare**, zgodnie z regułą „w razie konfliktu wybierz to, co lepiej wspiera Payload”.

## 2. Wersje — dlaczego nie najnowsze

Payload najnowszy stabilny to `3.88.0` (npm, sprawdzone `npm view payload version`), ale oficjalny szablon Cloudflare D1 pinuje `3.82.1` we wszystkich pakietach `@payloadcms/*` w lockstepie. Użyto **3.82.1** (sprawdzonej, przetestowanej przez Payload kombinacji dla Cloudflare), nie najnowszej — zgodnie z instrukcją „nie wymuszaj najnowszej wersji, jeśli gorzej wspierana”.

## 3. Błędy znalezione w oficjalnym szablonie (main branch GitHub vs opublikowane paczki)

Szablon na GitHub (`main`) okazał się w kilku miejscach niespójny z tym, co faktycznie opublikowano na npm — **zweryfikowane przez rozpakowanie paczek i realny build, nie przez czytanie dokumentacji**:

| Co szablon robi | Co faktycznie działa w 3.82.1 / 3.88.0 | Dowód |
|---|---|---|
| `generatePayloadViewport` z `@payloadcms/next/layouts` | Nie istnieje w opublikowanym pakiecie (`export { metadata, RootLayout } from ...`) | rozpakowanie `@payloadcms/next@3.88.0` z npm — brak eksportu |
| `storage: [r2Storage(...)]` w `buildConfig` | `r2Storage()` zwraca zwykły `Plugin` — trzeba go dać do `plugins: [...]` | `tsc` (TS2353: `storage` nie istnieje w `Config`) |
| `"build": "payload build"` w package.json szablonu | Komenda `build` **nie istnieje** w CLI Payloada 3.82.1 | uruchomienie zwróciło listę dostępnych komend bez `build` |
| `rateLimit` w `buildConfig` (sugerowane w starszej dokumentacji) | Nie istnieje w `Config` ani 3.82.1, ani 3.88.0 | `tsc` + `grep` po typach paczki |

Wszystkie poprawione w tym repo (patrz `src/payload.config.ts`, `src/app/(payload)/layout.tsx`, `package.json`).

## 4. Turbopack vs webpack — krytyczne dla działania builda

`next build` w Next.js 16 domyślnie używa **Turbopacka**. Payload (`withPayload()`) ma wbudowaną logikę externalizacji `drizzle-kit`/`drizzle-kit/api` (potrzebne przez `@payloadcms/db-d1-sqlite`), ale **własny kod Payloada zawiera komentarz wprost mówiący, że pod Turbopackiem `serverExternalPackages` nie działa dla zależności tranzytywnych** (pakietów niezainstalowanych bezpośrednio w projekcie) — externalizacja po prostu jest ignorowana.

Objaw: `opennextjs-cloudflare build` kończył się błędem esbuild `Could not resolve "drizzle-kit-<hash>/api"` — Turbopack zaszywał zhashowaną, syntetyczną nazwę modułu wprost do skompilowanego kodu, której esbuild (drugi etap bundlowania, już poza kontrolą Next.js) nie potrafił rozwiązać.

**Rozwiązanie zweryfikowane empirycznie:** budowanie z `next build --webpack` zamiast domyślnego Turbopacka. Pod webpackiem externalizacja działa poprawnie (webpack.externals, ustawiane przez `withPayload()` niezależnie od `serverExternalPackages`) i `opennextjs-cloudflare build` przechodzi czysto. Dodatkowo `drizzle-kit@0.31.7` dodano jako bezpośrednią `devDependency` (zalecenie z komentarza w kodzie Payloada — pozwala poprawnie rozwiązać pakiet z katalogu głównego projektu), choć sam w sobie nie jest używany w naszym kodzie (potrzebuje go tylko `payload migrate:create`).

Konsekwencja: **nie da się dziś (Next.js 16.3.3 + Payload 3.82.1) budować tego stacku na Cloudflare z domyślnym Turbopackiem.** To realne ograniczenie bieżącej kombinacji wersji, nie błąd konfiguracji z naszej strony.

## 5. `middleware.ts` → `proxy.ts`

Next.js 16 uznaje konwencję `middleware.ts` za przestarzałą na rzecz `proxy.ts` (ten sam mechanizm, inna nazwa pliku/eksportu — ma też jaśniej sugerować "cienką" warstwę, bez ciężkiej logiki biznesowej). Zmieniono zgodnie z oficjalnym komunikatem builda (`npx @next/codemod middleware-to-proxy` opisuje dokładnie tę zmianę).

## 6. Limit rozmiaru Workera — nieaktualne założenie z README Payloada

Oficjalny szablon Payloada twierdzi: *"This can only be deployed on Paid Workers right now due to size limits"* (limit 3 MB skompresowany na Free). **To zdanie jest już nieaktualne.**

4 września 2026 Cloudflare **usunął limit rozmiaru liczony na skompresowanym bundlu** (3 MB Free / 10 MB Paid) i zastąpił go limitem **64 MiB nieskompresowanego kodu, jednolitym dla wszystkich planów** (`developers.cloudflare.com/changelog/post/2026-09-04-increased-worker-size-limit/`). Zweryfikowany realny bundle tego projektu: `wrangler deploy --dry-run` pokazuje ok. 16.6 MB nieskompresowanego uploadu (skrypt + statyczne assety panelu Payload) — daleko od 64 MiB, także na planie Free.

**Ale to nie znaczy, że Free wystarczy.** Prawdziwe ograniczenie planu Free to **10 ms CPU na request** (Paid: domyślnie 30 s, do 5 min) — realistyczne SSR Next.js + zapytanie do D1 może to przekroczyć, zwłaszcza w panelu admina. Rekomendacja Workers Paid ($5/mies.) pozostaje aktualna, ale **z innego, bardziej aktualnego powodu niż podaje dokumentacja Payloada.**

## 7. Sharp / przetwarzanie obrazów

`sharp` to natywny moduł Node — niedostępny w workerd. Skutki:
- `Media.upload.crop = false`, `focalPoint = false`.
- Payload nadal poprawnie odczytuje podstawowe wymiary obrazu (szerokość/wysokość) bez sharp — zweryfikowane uploadem testowego SVG.
- Brak generowania miniatur/wariantów rozmiaru przy uploadzie. Do rozważenia później (nie wdrożone teraz, zgodnie z „nie komplikuj”): Cloudflare Images (osobna usługa, koszt) albo Cloudflare Image Resizing (transformacja w locie po URL, jeśli plan to obsługuje).

## 8. `skipSafeFetch` w Media

Payload domyślnie chroni się przed SSRF, blokując fetch do prywatnych adresów IP przy pobieraniu plików z URL. Ustawiliśmy `skipSafeFetch: true` (jak w oficjalnym szablonie), co jest **bezpieczne konkretnie na Workers** dzięki fladze `global_fetch_strictly_public` w `wrangler.jsonc` — sam runtime blokuje fetch do prywatnych zakresów IP na poziomie sieciowym, niezależnie od kodu aplikacji.

## 9. GraphQL

Wyłączone (`graphQL: { disable: true }`). Powody: (a) nieużywane — frontend czyta dane przez Local API, (b) nierozwiązany upstream issue w `workerd` dotyczący GraphQL (`github.com/cloudflare/workerd/issues/5175`, cytowany w README oficjalnego szablonu), (c) mniejszy bundle.

## 10. Cache / ISR

Strony renderowane z `dynamic = 'force-dynamic'` — czytają D1 przy każdym żądaniu zamiast pełnego SSG/ISR. Świadomy kompromis na start (poprawność > wydajność na tym etapie): pełne ISR wymagałoby skonfigurowania R2-backed incremental cache w OpenNext (`NEXT_INC_CACHE_R2_BUCKET`, już zostawione jako zakomentowany punkt rozszerzenia w `wrangler.jsonc`) i przetestowania invalidacji przy publikacji z panelu. D1 na Free daje 5 mln odczytów/dzień — dla strony na tym etapie ruchu to nie jest wąskie gardło.

## 11. Rate limiting — dlaczego D1, nie Redis/KV

Zgodnie z „nie dodawaj Redis, jeśli niepotrzebny”: throttling formularza kontaktowego liczy zgłoszenia po IP bezpośrednio w D1 (kolekcja `leads`, zapytanie `count` z filtrem czasowym) — zero dodatkowych usług/kosztów. To jest warstwa defense-in-depth; **twardszą, właściwą barierą powinna być reguła Rate Limiting / WAF na strefie Cloudflare** skonfigurowana ręcznie w dashboardzie (Cloudflare oferuje pewną liczbę reguł nawet na planie Free) — to nie jest coś, co da się zdeployować z tego repo (konfiguracja strefy, nie kodu), zostawione jako jawna decyzja do podjęcia przez Ciebie na koncie Cloudflare.

## 12. Node.js — wersja

`engines.node` w projekcie: `>=22.12.0`. Oficjalny szablon wymaga `>=24.15.0`. Środowisko, w którym budowano i testowano ten fundament, miało Node `22.22.2` — **wszystko (install, typecheck, build, opennextjs-cloudflare build, testy funkcjonalne) przeszło poprawnie na Node 22**. Rekomendacja: użyj Node ≥24 na produkcyjnym CI, jeśli to możliwe (zgodnie z oficjalnym wsparciem Payloada), ale nic w tym projekcie nie wymaga twardo Node 24 na dziś.

## Podsumowanie: co wymaga Twojej decyzji/akcji

1. Utworzenie realnych zasobów Cloudflare (D1, R2 dla `production` i `staging`) i wklejenie ich ID/nazw do `wrangler.jsonc`.
2. Potwierdzenie: Workers Paid ($5/mies.) ze względu na limit CPU (10ms/request na Free), nie rozmiar bundla.
3. Skonfigurowanie reguły Rate Limiting/WAF na strefie Cloudflare (dashboard) jako głównej bariery przeciw nadużyciom API — obecny D1-owy throttling to tylko druga linia obrony.
4. Decyzja o ewentualnym Cloudflare Images / Image Resizing, gdy przetwarzanie obrazów stanie się potrzebne.
5. Decyzja o włączeniu pełnego ISR (R2 incremental cache) — na razie strony są w pełni dynamiczne (poprawne, ale nie maksymalnie wydajne).
