import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { PriceSearchForm } from './PriceSearchForm'

describe('PriceSearchForm', () => {
  const defaultProps = {
    date: '2020-06-14T10:00',
    productId: '35455',
    brandId: '1',
    loading: false,
    onDateChange: vi.fn(),
    onProductIdChange: vi.fn(),
    onBrandIdChange: vi.fn(),
    onSubmit: vi.fn(),
  }

  it('renders all three input fields and submit button', () => {
    render(<PriceSearchForm {...defaultProps} />)

    expect(screen.getByLabelText(/fecha de aplicación/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/id de producto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/id de marca/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /consultar precio/i })).toBeInTheDocument()
  })

  it('calls onSubmit when form is submitted', async () => {
    render(<PriceSearchForm {...defaultProps} />)

    await userEvent.click(screen.getByRole('button', { name: /consultar precio/i }))
    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })

  it('shows loading text when loading is true', () => {
    render(<PriceSearchForm {...defaultProps} loading={true} />)

    expect(screen.getByRole('button', { name: /consultando/i })).toBeDisabled()
  })
})
