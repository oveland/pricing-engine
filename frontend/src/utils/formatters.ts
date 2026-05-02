import type { PriceTagParts } from '../types/price.types'

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return isoString
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(amount)
}

export function toIsoDateTime(dateTimeLocal: string): string {
  return dateTimeLocal.includes('T') ? dateTimeLocal + ':00' : dateTimeLocal
}

/**
 * Formatea un timestamp a formato legible para el slider.
 * Ejemplo: "14 jun 2020, 15:00"
 */
export function formatSliderDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Mapa de códigos de moneda a símbolos */
const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
}

/**
 * Desglosa un precio en partes separadas (integer, decimal, currency)
 * para renderizado diferenciado en PriceResult (Price Tag Display).
 *
 * Ejemplo: formatPriceTag(35.50, "EUR") → { integer: "35", decimal: "50", currency: "€" }
 */
export function formatPriceTag(amount: number, currencyCode: string): PriceTagParts {
  const fixed = amount.toFixed(2)
  const [integer, decimal] = fixed.split('.')
  const currency = CURRENCY_SYMBOLS[currencyCode] ?? currencyCode

  return { integer, decimal, currency }
}
