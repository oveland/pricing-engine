import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { usePriceSearch } from '../usePriceSearch'
import { SLIDER_MIN_TIMESTAMP } from '../../utils/slider.utils'

vi.mock('../../services/price.service', () => ({
  fetchApplicablePrice: vi.fn(),
}))

import { fetchApplicablePrice } from '../../services/price.service'

const mockFetch = vi.mocked(fetchApplicablePrice)

describe('usePriceSearch — slider integration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('dispara búsqueda automática cuando sliderValue debounced cambia', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      data: {
        productId: 35455,
        brandId: 1,
        priceList: 1,
        startDate: '2020-06-14T00:00:00',
        endDate: '2020-12-31T23:59:59',
        price: 35.5,
        currency: 'EUR',
      },
    })

    const { result } = renderHook(() => usePriceSearch())

    // Initial mount — no search should be triggered
    expect(mockFetch).not.toHaveBeenCalled()

    // Change slider value
    act(() => {
      result.current.setSliderValue(SLIDER_MIN_TIMESTAMP + 3_600_000) // +1 hour
    })

    // Before debounce completes, no search
    await act(async () => {
      vi.advanceTimersByTime(199)
    })
    expect(mockFetch).not.toHaveBeenCalled()

    // After debounce (200ms), search is triggered
    await act(async () => {
      vi.advanceTimersByTime(1)
    })
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result.current.state.kind).toBe('success')
  })

  it('muestra error cuando consulta automática del slider falla', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      error: {
        status: 404,
        error: 'Not Found',
        message: 'No applicable price found',
        timestamp: '2020-06-14T01:00:00',
      },
    })

    const { result } = renderHook(() => usePriceSearch())

    // Change slider value to trigger search
    act(() => {
      result.current.setSliderValue(SLIDER_MIN_TIMESTAMP + 7_200_000) // +2 hours
    })

    // Wait for debounce
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result.current.state.kind).toBe('error')
    if (result.current.state.kind === 'error') {
      expect(result.current.state.error.message).toBe('No applicable price found')
    }
  })

  it('no dispara búsqueda en el mount inicial', async () => {
    const { result } = renderHook(() => usePriceSearch())

    // Advance timers well past debounce period
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    // No search should have been triggered on mount
    expect(mockFetch).not.toHaveBeenCalled()
    expect(result.current.state.kind).toBe('idle')
  })
})
