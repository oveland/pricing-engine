import type { SliderMarker } from '../types/price.types'

/** Inicio del rango crítico: 14 jun 2020 00:00 */
export const SLIDER_MIN_TIMESTAMP = new Date('2020-06-14T00:00:00').getTime()

/** Fin del rango crítico: 16 jun 2020 23:59 */
export const SLIDER_MAX_TIMESTAMP = new Date('2020-06-16T23:59:00').getTime()

/** Marcadores de transición de precios precalculados */
export const PRICE_TRANSITION_MARKERS: SliderMarker[] = [
  { timestamp: new Date('2020-06-14T15:00:00').getTime(), label: 'Inicio tarifa 2 — 25.45€' },
  { timestamp: new Date('2020-06-14T18:30:00').getTime(), label: 'Fin tarifa 2' },
  { timestamp: new Date('2020-06-15T00:00:00').getTime(), label: 'Inicio tarifa 3 — 30.50€' },
  { timestamp: new Date('2020-06-15T11:00:00').getTime(), label: 'Fin tarifa 3' },
  { timestamp: new Date('2020-06-15T16:00:00').getTime(), label: 'Inicio tarifa 4 — 38.95€' },
]

/**
 * Convierte un timestamp a posición porcentual en el slider [0, 100].
 * Valores fuera del rango se clampean a los extremos.
 */
export function timestampToPercent(timestamp: number): number {
  const range = SLIDER_MAX_TIMESTAMP - SLIDER_MIN_TIMESTAMP
  const raw = ((timestamp - SLIDER_MIN_TIMESTAMP) / range) * 100
  return Math.min(100, Math.max(0, raw))
}

/**
 * Convierte un timestamp (ms) a string formato datetime-local: `YYYY-MM-DDTHH:MM`.
 * Usa hora local (no UTC) porque `<input type="datetime-local">` trabaja con hora local.
 */
export function timestampToDateTimeLocal(timestamp: number): string {
  const d = new Date(timestamp)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Convierte un string datetime-local (`YYYY-MM-DDTHH:MM`) a timestamp en milisegundos.
 * Usa hora local (no UTC) porque `<input type="datetime-local">` trabaja con hora local.
 */
export function dateTimeLocalToTimestamp(dateTimeLocal: string): number {
  return new Date(dateTimeLocal).getTime()
}
