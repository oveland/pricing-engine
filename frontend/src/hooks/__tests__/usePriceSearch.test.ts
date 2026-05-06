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
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('dispara búsqueda cuando se suelta el slider (handleSliderChangeEnd)', async () => {
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

    // Arrastrar slider — solo actualiza preview, no dispara consulta
    act(() => {
      result.current.handleSliderChange(SLIDER_MIN_TIMESTAMP + 3_600_000)
    })

    expect(mockFetch).not.toHaveBeenCalled()
    // La fecha se actualiza como preview
    expect(result.current.date).toContain('2020-06-14T01:00')

    // Soltar slider — dispara consulta
    await act(async () => {
      await result.current.handleSliderChangeEnd(SLIDER_MIN_TIMESTAMP + 3_600_000)
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result.current.state.kind).toBe('success')
  })

  it('muestra error cuando consulta del slider falla', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      error: {
        status: 404,
        error: 'Not Found',
        message: 'No applicable price found',
        timestamp: '2020-06-14T02:00:00',
      },
    })

    const { result } = renderHook(() => usePriceSearch())

    // Soltar slider — dispara consulta que falla
    await act(async () => {
      await result.current.handleSliderChangeEnd(SLIDER_MIN_TIMESTAMP + 7_200_000)
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result.current.state.kind).toBe('error')
    if (result.current.state.kind === 'error') {
      expect(result.current.state.error.message).toBe('No applicable price found')
    }
  })

  it('no dispara búsqueda en el mount inicial', () => {
    renderHook(() => usePriceSearch())

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('search() muestra network-error cuando fetch lanza excepción', async () => {
    mockFetch.mockRejectedValue(new Error('Network failure'))

    const { result } = renderHook(() => usePriceSearch())

    await act(async () => {
      await result.current.search()
    })

    expect(result.current.state.kind).toBe('network-error')
    if (result.current.state.kind === 'network-error') {
      expect(result.current.state.message).toContain('No se pudo conectar')
    }
  })

  it('search() muestra error cuando respuesta no es ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      error: {
        status: 400,
        error: 'Bad Request',
        message: 'Invalid parameters',
        timestamp: '2020-06-14T10:00:00',
      },
    })

    const { result } = renderHook(() => usePriceSearch())

    await act(async () => {
      await result.current.search()
    })

    expect(result.current.state.kind).toBe('error')
    if (result.current.state.kind === 'error') {
      expect(result.current.state.error.message).toBe('Invalid parameters')
    }
  })

  it('search() muestra success cuando respuesta es ok', async () => {
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

    await act(async () => {
      await result.current.search()
    })

    expect(result.current.state.kind).toBe('success')
  })

  it('handleSliderChangeEnd muestra network-error cuando fetch lanza excepción', async () => {
    mockFetch.mockRejectedValue(new Error('Network failure'))

    const { result } = renderHook(() => usePriceSearch())

    await act(async () => {
      await result.current.handleSliderChangeEnd(SLIDER_MIN_TIMESTAMP + 3_600_000)
    })

    expect(result.current.state.kind).toBe('network-error')
  })
})
