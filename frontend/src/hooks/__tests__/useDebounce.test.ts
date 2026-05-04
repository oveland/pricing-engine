import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('retorna valor inicial inmediatamente', () => {
    const { result } = renderHook(() => useDebounce('hello', 500))
    expect(result.current).toBe('hello')
  })

  it('retrasa actualización por el delay especificado', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 300 },
    })

    // Cambiar el valor
    rerender({ value: 'updated', delay: 300 })

    // Antes de que pase el delay, el valor debounced no cambia
    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe('initial')

    // Después del delay, el valor se actualiza
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('updated')
  })

  it('usa delay por defecto de 500ms', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'first' },
    })

    rerender({ value: 'second' })

    // A los 499ms aún no cambia
    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(result.current).toBe('first')

    // A los 500ms se actualiza
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('second')
  })

  it('cancela actualizaciones pendientes ante nuevos cambios rápidos', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    })

    // Cambio rápido 1
    rerender({ value: 'b' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Cambio rápido 2 — cancela el timer anterior
    rerender({ value: 'c' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Cambio rápido 3 — cancela el timer anterior
    rerender({ value: 'd' })

    // El valor debounced sigue siendo el inicial
    expect(result.current).toBe('a')

    // Después de 500ms desde el último cambio, se actualiza al último valor
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe('d')
  })
})
