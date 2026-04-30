import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PriceSearchPage } from './PriceSearchPage'

describe('PriceSearchPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders form with all inputs', () => {
    render(<PriceSearchPage />)

    expect(screen.getByLabelText(/fecha de aplicación/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/id de producto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/id de marca/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /consultar precio/i })).toBeInTheDocument()
  })

  it('displays price result on successful API response', async () => {
    const mockResponse = {
      productId: 35455,
      brandId: 1,
      priceList: 2,
      startDate: '2020-06-14T15:00:00',
      endDate: '2020-06-14T18:30:00',
      price: 25.45,
      currency: 'EUR',
    }

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    render(<PriceSearchPage />)
    await userEvent.click(screen.getByRole('button', { name: /consultar precio/i }))

    await waitFor(() => {
      expect(screen.getByText(/precio encontrado/i)).toBeInTheDocument()
    })
  })

  it('displays error on HTTP 404', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        status: 404,
        error: 'Not Found',
        message: 'No applicable price found',
        timestamp: '2026-04-29T10:00:00',
      }),
    } as Response)

    render(<PriceSearchPage />)
    await userEvent.click(screen.getByRole('button', { name: /consultar precio/i }))

    await waitFor(() => {
      expect(screen.getByText(/precio no encontrado/i)).toBeInTheDocument()
    })
  })

  it('displays network error when fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))

    render(<PriceSearchPage />)
    await userEvent.click(screen.getByRole('button', { name: /consultar precio/i }))

    await waitFor(() => {
      expect(screen.getByText(/error de conexión/i)).toBeInTheDocument()
    })
  })
})
