import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import tailwindConfig from '../../tailwind.config.js'

/**
 * Retail visual identity tests
 * Validates: Requirements 1.6, 8.6, 8.10
 */
describe('Retail Visual Identity — Tailwind config & CSS', () => {
  const theme = tailwindConfig.theme?.extend ?? {}

  /* ── Req 8.6: Editorial font family (Inter) ── */
  describe('typography — editorial font family', () => {
    it('Tailwind config includes editorial font family with Inter as primary', () => {
      expect(theme.fontFamily).toBeDefined()
      expect(theme.fontFamily!.editorial).toBeDefined()
      expect(theme.fontFamily!.editorial[0]).toBe('Inter')
    })

    it('Tailwind config defines maximum 2 font families (Req 8.10)', () => {
      const fontFamilyKeys = Object.keys(theme.fontFamily ?? {})
      // Only custom font families defined in extend — system defaults don't count
      expect(fontFamilyKeys.length).toBeLessThanOrEqual(2)
    })
  })

  /* ── Req 8.6: Letter-spacing tokens ── */
  describe('typography — letter-spacing tokens', () => {
    it('defines brand letter-spacing as 0.35em', () => {
      expect(theme.letterSpacing).toBeDefined()
      expect(theme.letterSpacing!.brand).toBe('0.35em')
    })

    it('defines tagline letter-spacing as 0.1em', () => {
      expect(theme.letterSpacing!.tagline).toBe('0.1em')
    })

    it('defines label letter-spacing as 0.05em', () => {
      expect(theme.letterSpacing!.label).toBe('0.05em')
    })
  })

  /* ── Req 8.6: fontSize tokens ── */
  describe('typography — fontSize tokens', () => {
    it('defines price-tag fontSize token', () => {
      expect(theme.fontSize).toBeDefined()
      expect(theme.fontSize!['price-tag']).toBeDefined()
    })

    it('defines brand fontSize token', () => {
      expect(theme.fontSize!.brand).toBeDefined()
    })
  })

  /* ── Req 1.6: Warm retail accent colors ── */
  describe('color palette — warm retail accents', () => {
    it('includes accent.gold with value #d4af37', () => {
      const accent = theme.colors?.dark?.accent
      expect(accent).toBeDefined()
      expect(accent!.gold).toBe('#d4af37')
    })

    it('includes accent.sand with value #c2b280', () => {
      const accent = theme.colors?.dark?.accent
      expect(accent!.sand).toBe('#c2b280')
    })
  })

  /* ── Req 8.10: Color palette restricted to darks + whites + one warm accent ── */
  describe('color palette — coherent with Retail_Fashion_Aesthetic', () => {
    it('palette is restricted to dark namespace (darks + whites + warm accent)', () => {
      const colorKeys = Object.keys(theme.colors ?? {})
      // All custom colors should be under the "dark" namespace
      expect(colorKeys).toContain('dark')
      // No bright/saturated color namespaces that would break the retail aesthetic
      const nonRetailColors = colorKeys.filter(
        (key) => !['dark'].includes(key),
      )
      expect(nonRetailColors).toEqual([])
    })

    it('dark color palette includes background, text, and accent groups', () => {
      const dark = theme.colors?.dark
      expect(dark).toBeDefined()
      expect(dark!.bg).toBeDefined()
      expect(dark!.text).toBeDefined()
      expect(dark!.accent).toBeDefined()
    })

    it('text colors use warm tones (not blue-tinted whites)', () => {
      const text = theme.colors?.dark?.text
      expect(text).toBeDefined()
      expect(text!.primary).toBe('#f5f5f0')
      expect(text!.secondary).toBe('#a0998c')
    })
  })

  /* ── Req 8.6: index.css imports Inter font from Google Fonts ── */
  describe('index.css — Inter font import', () => {
    const cssPath = path.resolve(__dirname, '../index.css')
    const cssContent = fs.readFileSync(cssPath, 'utf-8')

    it('imports Inter font from Google Fonts', () => {
      expect(cssContent).toContain('fonts.googleapis.com')
      expect(cssContent).toContain('Inter')
    })

    it('imports Inter with weight 300 (light)', () => {
      expect(cssContent).toMatch(/300/)
    })

    it('imports Inter with weight 400 (regular)', () => {
      expect(cssContent).toMatch(/400/)
    })

    it('imports Inter with weight 500 (medium)', () => {
      expect(cssContent).toMatch(/500/)
    })
  })
})
