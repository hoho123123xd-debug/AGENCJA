import type { Solution } from '@/content/home'

const PATHS: Record<Solution['icon'], string> = {
  web: 'M3 5h18v14H3V5Zm0 4h18M8 5v14',
  shop: 'M4 8h16l-1.5 11h-13L4 8Zm3-3a3 3 0 0 1 6 0',
  app: 'M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z',
  system: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l3 3M18 6l-3 3M6 18l3-3M18 18l-3-3M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  automation: 'M13 2 4 14h6l-1 8 9-12h-6l1-8Z',
  integration: 'M6 8a3 3 0 1 0 0 6M18 8a3 3 0 1 1 0 6M9 11h6',
}

export const SolutionIcon = ({ icon }: { icon: Solution['icon'] }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d={PATHS[icon]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
