import * as fc from 'fast-check'
import {
  timestampToPercent,
  timestampToDateTimeLocal,
  dateTimeLocalToTimestamp,
  SLIDER_MIN_TIMESTAMP,
  SLIDER_MAX_TIMESTAMP,
} from '../slider.utils'
import { formatSliderDate, formatPriceTag } from '../formatters'

/**
 * Property-based tests para las utilidades del slider y formateo de precios.
 * Cada propiedad valida un invariante universal que debe cumplirse para TODOS
 * los inputs posibles dentro del dominio, no solo para ejemplos específicos.
 */

describe('Propiedad 1 — Rango acotado de timestampToPercent', () => {
  /**
   * **Validates: Requirements 4.9**
   *
   * Para cualquier timestamp dentro del rango del slider,
   * timestampToPercent siempre devuelve un valor en [0, 100].
   */
  it('siempre devuelve un valor en [0, 100] para timestamps en el rango del slider', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: SLIDER_MIN_TIMESTAMP, max: SLIDER_MAX_TIMESTAMP }),
        (timestamp) => {
          const percent = timestampToPercent(timestamp)
          return percent >= 0 && percent <= 100
        },
      ),
      { numRuns: 100 },
    )
  })
})

describe('Propiedad 2 — Monotonicidad de timestampToPercent', () => {
  /**
   * **Validates: Requirements 4.9**
   *
   * Para cualquier par de timestamps t1 < t2 dentro del rango del slider,
   * timestampToPercent(t1) <= timestampToPercent(t2).
   * Esto garantiza que el slider se comporta de forma predecible:
   * mover hacia la derecha siempre avanza en el tiempo.
   */
  it('timestampToPercent(t1) <= timestampToPercent(t2) cuando t1 < t2', () => {
    fc.assert(
      fc.property(
        fc
          .tuple(
            fc.integer({ min: SLIDER_MIN_TIMESTAMP, max: SLIDER_MAX_TIMESTAMP }),
            fc.integer({ min: SLIDER_MIN_TIMESTAMP, max: SLIDER_MAX_TIMESTAMP }),
          )
          .filter(([a, b]) => a < b),
        ([t1, t2]) => {
          return timestampToPercent(t1) <= timestampToPercent(t2)
        },
      ),
      { numRuns: 100 },
    )
  })
})

describe('Propiedad 3 — Round-trip timestamp ↔ dateTimeLocal', () => {
  /**
   * **Validates: Requirements 4.3**
   *
   * Para cualquier timestamp redondeado a minutos (múltiplo de 60000)
   * dentro del rango del slider, la conversión timestamp → dateTimeLocal → timestamp
   * es una identidad: no se pierde información en el round-trip.
   */
  it('dateTimeLocalToTimestamp(timestampToDateTimeLocal(t)) === t para timestamps redondeados a minutos', () => {
    const minMinute = Math.ceil(SLIDER_MIN_TIMESTAMP / 60000)
    const maxMinute = Math.floor(SLIDER_MAX_TIMESTAMP / 60000)

    fc.assert(
      fc.property(
        fc.integer({ min: minMinute, max: maxMinute }).map((m) => m * 60000),
        (timestamp) => {
          const dateTimeLocal = timestampToDateTimeLocal(timestamp)
          const reconstructed = dateTimeLocalToTimestamp(dateTimeLocal)
          return reconstructed === timestamp
        },
      ),
      { numRuns: 100 },
    )
  })
})

describe('Propiedad 4 — Validez del formato de formatSliderDate', () => {
  /**
   * **Validates: Requirements 4.3**
   *
   * Para cualquier timestamp en el rango del slider, formatSliderDate
   * produce un string que contiene: día numérico (1-31), nombre de mes,
   * año de 4 dígitos y hora en formato HH:MM.
   */
  it('el resultado contiene día numérico, nombre de mes, año 4 dígitos y hora HH:MM', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: SLIDER_MIN_TIMESTAMP, max: SLIDER_MAX_TIMESTAMP }),
        (timestamp) => {
          const formatted = formatSliderDate(timestamp)

          // Día numérico (1-31)
          const hasDay = /\b([1-9]|[12]\d|3[01])\b/.test(formatted)
          // Nombre de mes (abreviado en español)
          const hasMonth = /[a-záéíóú]{3,}/i.test(formatted)
          // Año de 4 dígitos
          const hasYear = /\b20\d{2}\b/.test(formatted)
          // Hora HH:MM
          const hasTime = /\d{1,2}:\d{2}/.test(formatted)

          return hasDay && hasMonth && hasYear && hasTime
        },
      ),
      { numRuns: 100 },
    )
  })
})

describe('Propiedad 5 — Round-trip de formatPriceTag', () => {
  /**
   * **Validates: Requirements 8.3**
   *
   * Para cualquier precio positivo con hasta 2 decimales,
   * formatPriceTag desglosa el precio en partes (integer, decimal, currency)
   * de forma que se puede reconstruir el valor original sin pérdida.
   * Además, para EUR el símbolo de moneda siempre es "€".
   */
  it('el valor reconstruido desde parts.integer + parts.decimal es igual al amount original, y currency es "€"', () => {
    fc.assert(
      fc.property(
        fc
          .float({ min: Math.fround(0.01), max: Math.fround(99999.99), noNaN: true })
          .map((n) => Math.round(n * 100) / 100),
        (amount) => {
          const parts = formatPriceTag(amount, 'EUR')
          const reconstructed = parseFloat(parts.integer + '.' + parts.decimal)

          return reconstructed === amount && parts.currency === '€'
        },
      ),
      { numRuns: 100 },
    )
  })
})
