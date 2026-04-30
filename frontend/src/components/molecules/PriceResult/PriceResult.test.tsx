import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PriceResult } from './PriceResult'

describe('PriceResult', () => {
  const props = {
    productId: 35455,
    brandId: 1,
    priceList: 2,
    startDate: '2020-06-14T15:00:00',
    endDate: '2020-06-14T18:30:00',
    price: 25.45,
    currency: 'EUR',
  }

  it('renders price found heading', () => {
    render(<PriceResult {...props} />)
    expect(screen.getByText(/precio encontrado/i)).toBeInTheDocument()
  })

  it('displays product and brand IDs', () => {
    render(<PriceResult {...props} />)
    expect(screen.getByText('35455')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('displays price list number', () => {
    render(<PriceResult {...props} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
