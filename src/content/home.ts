/**
 * Treść strony głównej — celowo wydzielona z komponentów jako zwykłe dane.
 * Gdy ta strona trafi pod zarządzanie Payload (osobny Global, nie generyczny
 * page-builder — layout jest zbyt bespoke na kontrolowane bloki), komponenty
 * sekcji zostaną bez zmian: zmieni się tylko źródło tych obiektów
 * (`await payload.findGlobal({ slug: 'home' })` zamiast importu z tego pliku).
 */

export type Solution = {
  id: string
  label: string
  description: string
  icon: 'web' | 'shop' | 'app' | 'system' | 'automation' | 'integration'
  stat: { value: string; label: string }
}

export const solutions: Solution[] = [
  {
    id: 'websites',
    label: 'Strony internetowe',
    description: 'Nowoczesne wizytówki i serwisy firmowe, które robią wrażenie od pierwszej sekundy.',
    icon: 'web',
    stat: { value: '<1s', label: 'czas ładowania' },
  },
  {
    id: 'ecommerce',
    label: 'Sklepy internetowe',
    description: 'Skuteczna sprzedaż online — od katalogu po płatność, bez tarcia po drodze.',
    icon: 'shop',
    stat: { value: '+38%', label: 'śr. wzrost konwersji' },
  },
  {
    id: 'apps',
    label: 'Aplikacje webowe',
    description: 'Narzędzia dopasowane do Twoich procesów, nie odwrotnie.',
    icon: 'app',
    stat: { value: '24/7', label: 'dostępność' },
  },
  {
    id: 'systems',
    label: 'Systemy dedykowane',
    description: 'Rozwiązania szyte na miarę tam, gdzie gotowe produkty już nie wystarczają.',
    icon: 'system',
    stat: { value: '100%', label: 'dopasowanie' },
  },
  {
    id: 'automation',
    label: 'Automatyzacje',
    description: 'Oszczędzaj czas i eliminuj powtarzalne zadania w Twojej firmie.',
    icon: 'automation',
    stat: { value: '-70%', label: 'pracy ręcznej' },
  },
  {
    id: 'integrations',
    label: 'Integracje',
    description: 'Łączymy narzędzia i dane, żeby działały jako jedna spójna całość.',
    icon: 'integration',
    stat: { value: '1 system', label: 'zamiast wielu' },
  },
]

export type Demo = {
  id: string
  label: string
  title: string
  description: string
}

export const demos: Demo[] = [
  {
    id: 'website',
    label: 'Website',
    title: 'Serwis firmowy z pełnym CMS-em',
    description: 'Szybka, semantyczna strona z panelem treści — edytorzy zarządzają wszystkim bez pomocy developera.',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    title: 'Sklep z katalogiem i koszykiem',
    description: 'Kompletny sklep: produkty, warianty, koszyk i płatności zintegrowane w jednym spójnym flow.',
  },
  {
    id: 'cms',
    label: 'CMS',
    title: 'Zarządzanie treścią bez ograniczeń',
    description: 'Kontrolowany page builder — edytorzy układają strony z gotowych bloków, bez ryzyka zepsucia designu.',
  },
  {
    id: 'admin',
    label: 'Admin Panel',
    title: 'Panel administracyjny szyty na miarę',
    description: 'Role, uprawnienia, audyt zmian — panel, który rośnie razem z Twoją organizacją.',
  },
  {
    id: 'business-app',
    label: 'Business App',
    title: 'Aplikacja usprawniająca procesy',
    description: 'Narzędzie zaprojektowane wokół Twojego procesu biznesowego, nie odwrotnie.',
  },
]

export const problemStages = ['Problem', 'Chaos', 'Ręczna praca', 'Błędy']
export const solutionStages = ['Rozwiązanie', 'System', 'Automatyzacja', 'Kontrola']

export type ProcessStep = {
  index: string
  title: string
  description: string
}

export const processSteps: ProcessStep[] = [
  { index: '01', title: 'Rozmowa i analiza', description: 'Poznajemy Twój biznes, cele i realny problem do rozwiązania.' },
  { index: '02', title: 'Strategia i koncepcja', description: 'Projektujemy podejście — zakres, technologię, priorytety.' },
  { index: '03', title: 'Projekt i design', description: 'Tworzymy design dopasowany do marki i celów biznesowych.' },
  { index: '04', title: 'Development i integracje', description: 'Budujemy i łączymy systemy — solidnie, bezpiecznie, skalowalnie.' },
  { index: '05', title: 'Wdrożenie i rozwój', description: 'Uruchamiamy i zostajemy przy Tobie na dalszy rozwój.' },
]

export type Technology = {
  id: string
  label: string
  usage: string
}

export const technologies: Technology[] = [
  { id: 'react', label: 'React', usage: 'Interfejsy użytkownika — szybkie, komponentowe, łatwe w rozwoju.' },
  { id: 'nextjs', label: 'Next.js', usage: 'Framework aplikacji: renderowanie, routing, wydajność od podstaw.' },
  { id: 'typescript', label: 'TypeScript', usage: 'Bezpieczeństwo typów — mniej błędów, łatwiejsze utrzymanie kodu.' },
  { id: 'nodejs', label: 'Node.js', usage: 'Backend i API — szybkie, skalowalne środowisko serwerowe.' },
  { id: 'python', label: 'Python', usage: 'Automatyzacje, integracje i przetwarzanie danych.' },
  { id: 'postgresql', label: 'PostgreSQL', usage: 'Relacyjne bazy danych dla systemów wymagających skali.' },
  { id: 'cloudflare', label: 'Cloudflare', usage: 'Globalna infrastruktura — szybkość, bezpieczeństwo, edge computing.' },
  { id: 'shopify', label: 'Shopify', usage: 'E-commerce dla marek, które potrzebują sprawdzonej platformy.' },
  { id: 'docker', label: 'Docker', usage: 'Spójne środowiska — od developmentu po produkcję.' },
  { id: 'figma', label: 'Figma', usage: 'Design i prototypowanie — od koncepcji do gotowego interfejsu.' },
]
