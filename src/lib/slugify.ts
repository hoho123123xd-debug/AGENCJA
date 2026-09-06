// Polskie znaki diakrytyczne to odrębne litery Unicode (nie kompozycje
// bazowa-litera + znak diakrytyczny), więc NFKD ich nie rozbije — stąd
// jawna mapa zamiast (albo obok) normalizacji.
const POLISH_CHAR_MAP: Record<string, string> = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
}

/** Prosty, zależny wyłącznie od Web API slugify (bez pakietów Node-only). */
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => POLISH_CHAR_MAP[char] ?? char)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
