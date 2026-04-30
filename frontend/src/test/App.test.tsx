import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'

describe('App — Price Search Form', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders form with date, productId and brandId inputs', () => {
    render(<App />)

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

    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /consultar precio/i }))

    await waitFor(() => {
      expect(screen.getByText(/precio encontrado/i)).toBeInTheDocument()
    })

    expect(screen.getByText('35455')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('displays error message on HTTP 404 response', async () => {
    const mockError = {
      status: 404,
      error: 'Not Found',
      message: 'No applicable price found for brandId=1, productId=35455 at 2020-06-14T10:00:00',
      timestamp: '2026-04-29T10:00:00',
    }

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    } as Response)

    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /consultar precio/i }))

    await waitFor(() => {
      expect(screen.getByText(/precio no encontrado/i)).toBeInTheDocument()
    })

    expect(screen.getByText(mockError.message)).toBeInTheDocument()
  })

  it('displays error message on HTTP 400 response', async () => {
    const mockError = {
      status: 400,
      error: 'Bad Request',
      message: "Failed to convert value 'invalid' to required type",
      timestamp: '2026-04-29T10:00:00',
    }

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    } as Response)

    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /consultar precio/i }))

    await waitFor(() => {
      expect(screen.getByText(/parámetros inválidos/i)).toBeInTheDocument()
    })

    expect(screen.getByText(mockError.message)).toBeInTheDocument()
  })

  it('displays network error when fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))

    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /consultar precio/i }))

    await waitFor(() => {
      expect(screen.getByText(/error de conexión/i)).toBeInTheDocument()
    })
  })
})
