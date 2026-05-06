import { describe, it, expect } from 'vitest'
import {
  formatDateTime,
  formatPrice,
  toIsoDateTime,
  formatSliderDate,
  formatPriceTag,
} from '../formatters'

describe('formatters', () => {
  describe('formatDateTime', () => {
    it('formats a valid ISO string to es-ES locale', () => {
      const result = formatDateTime('2020-06-14T15:00:00')
      expect(result).toBeTruthy()
      expect(result).not.toBe('2020-06-14T15:00:00')
    })

    it('returns the original string for invalid dates', () => {
      const result = formatDateTime('not-a-date')
      expect(result).toBe('not-a-date')
    })
  })

  describe('formatPrice', () => {
    it('formats EUR currency', () => {
      const result = formatPrice(35.5, 'EUR')
      expect(result).toContain('35')
    })

    it('formats USD currency', () => {
      const result = formatPrice(100, 'USD')
      expect(result).toContain('100')
    })
  })

  describe('toIsoDateTime', () => {
    it('returns input unchanged if no T separator', () => {
      expect(toIsoDateTime('2020-06-14')).toBe('2020-06-14')
    })

    it('appends :00 when only HH:MM is present', () => {
      expect(toIsoDateTime('2020-06-14T15:00')).toBe('2020-06-14T15:00:00')
    })

    it('does not append seconds when already present', () => {
      expect(toIsoDateTime('2020-06-14T15:00:00')).toBe('2020-06-14T15:00:00')
    })
  })

  describe('formatSliderDate', () => {
    it('formats a timestamp to readable date', () => {
      const timestamp = new Date('2020-06-14T15:00:00').getTime()
      const result = formatSliderDate(timestamp)
      expect(result).toContain('2020')
      expect(result).toContain('14')
    })
  })

  describe('formatPriceTag', () => {
    it('splits EUR price into parts with symbol', () => {
      const result = formatPriceTag(35.5, 'EUR')
      expect(result).toEqual({ integer: '35', decimal: '50', currency: '€' })
    })

    it('splits USD price into parts with symbol', () => {
      const result = formatPriceTag(100.99, 'USD')
      expect(result).toEqual({ integer: '100', decimal: '99', currency: '$' })
    })

    it('splits GBP price into parts with symbol', () => {
      const result = formatPriceTag(42.0, 'GBP')
      expect(result).toEqual({ integer: '42', decimal: '00', currency: '£' })
    })

    it('uses currency code when symbol is not mapped', () => {
      const result = formatPriceTag(10.5, 'JPY')
      expect(result).toEqual({ integer: '10', decimal: '50', currency: 'JPY' })
    })
  })
})
