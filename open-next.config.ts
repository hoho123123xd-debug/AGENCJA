// Konfiguracja @opennextjs/cloudflare — adapter budujący Next.js do Cloudflare
// Workers. To jest oficjalnie wspierana przez Payload ścieżka deploymentu
// (nie "vinext", które na dziś jest eksperymentalnym projektem Cloudflare
// i nie jest tym, na czym Payload testuje swój oficjalny szablon D1).
import { defineCloudflareConfig } from '@opennextjs/cloudflare/config'

export default defineCloudflareConfig({})
