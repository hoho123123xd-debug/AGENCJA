import { describe, expect, it } from 'vitest'
import { slugify } from '@/lib/slugify'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('O Nas i Zespole')).toBe('o-nas-i-zespole')
  })

  it('strips diacritics', () => {
    expect(slugify('Usługi Sklepów Internetowych')).toBe('uslugi-sklepow-internetowych')
  })

  it('trims stray hyphens', () => {
    expect(slugify('  --Kontakt--  ')).toBe('kontakt')
  })
})
