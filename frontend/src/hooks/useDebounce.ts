import { useState, useEffect } from 'react'

/**
 * Retrasa la actualización de un valor hasta que deja de cambiar
 * durante el período de delay especificado.
 *
 * @param value - Valor a debounce
 * @param delay - Milisegundos de espera (default: 500)
 * @returns Valor estabilizado
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
