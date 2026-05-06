import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchApplicablePrice } from '../price.service'

describe('price.service — fetchApplicablePrice', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns ok with data when response is successful', async () => {
    const mockData = {
      productId: 35455,
      brandId: 1,
      priceList: 2,
      startDate: '2020-06-14T15:00:00',
      endDate: '2020-06-14T18:30:00',
      price: 25.45,
      currency: 'EUR',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    })

    const result = await fetchApplicablePrice({
      date: '2020-06-14T16:00:00',
      productId: '35455',
      brandId: '1',
    })

    expect(result).toEqual({ ok: true, data: mockData })
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/prices?'))
  })

  it('returns error when response is not ok', async () => {
    const mockError = {
      status: 404,
      error: 'Not Found',
      message: 'No applicable price found',
      timestamp: '2020-06-14T16:00:00',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve(mockError),
    })

    const result = await fetchApplicablePrice({
      date: '2020-06-14T16:00:00',
      productId: '99999',
      brandId: '1',
    })

    expect(result).toEqual({ ok: false, error: mockError })
  })

  it('builds correct query params from input', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    })

    await fetchApplicablePrice({
      date: '2020-06-15T10:00:00',
      productId: '35455',
      brandId: '1',
    })

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    expect(calledUrl).toContain('date=2020-06-15T10%3A00%3A00')
    expect(calledUrl).toContain('productId=35455')
    expect(calledUrl).toContain('brandId=1')
  })
})
