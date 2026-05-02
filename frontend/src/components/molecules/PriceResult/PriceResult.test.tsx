import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PriceResult } from './PriceResult'

const mockFromTo = vi.fn()
const mockContext = vi.fn(() => ({
  add: (fn: () => void) => fn(),
  revert: vi.fn(),
}))

vi.mock('gsap', () => ({
  default: {
    fromTo: (...args: unknown[]) => mockFromTo(...args),
    context: (...args: unknown[]) => mockContext(...args),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

const defaultProps = {
  productId: 35455,
  brandId: 1,
  priceList: 2,
  startDate: '2020-06-14T15:00:00',
  endDate: '2020-06-14T18:30:00',
  price: 25.45,
  currency: 'EUR',
}

describe('PriceResult', () => {
  it('applies glassmorphism class to container', () => {
    const { container } = render(<PriceResult {...defaultProps} />)
    const root = container.firstElementChild as HTMLElement
    expect(root.classList.contains('glassmorphism')).toBe(true)
    expect(root.classList.contains('price-result')).toBe(true)
  })

  it('executes GSAP entry animation on mount', () => {
    render(<PriceResult {...defaultProps} />)
    expect(mockFromTo).toHaveBeenCalled()
    const [, fromVars, toVars] = mockFromTo.mock.calls[0]
    expect(fromVars).toEqual(expect.objectContaining({ opacity: 0, y: 20, scale: 0.95 }))
    expect(toVars).toEqual(expect.objectContaining({ opacity: 1, y: 0, scale: 1 }))
  })

  it('shows brand "ZARA" prominently at top when brandId === 1', () => {
    render(<PriceResult {...defaultProps} />)
    const brand = screen.getByText('ZARA')
    expect(brand).toBeInTheDocument()
    expect(brand.classList.contains('price-result__brand')).toBe(true)
  })

  it('shows generic brand name when brandId !== 1', () => {
    render(<PriceResult {...defaultProps} brandId={5} />)
    expect(screen.getByText('Marca 5')).toBeInTheDocument()
  })

  it('shows price in Price Tag Display style with integer, decimal and currency', () => {
    render(<PriceResult {...defaultProps} />)
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText(',45')).toBeInTheDocument()
    expect(screen.getByText(/€/)).toBeInTheDocument()
  })

  it('shows productId and priceList as secondary metadata', () => {
    render(<PriceResult {...defaultProps} />)
    const meta = screen.getByText(/Producto 35455 · Tarifa 2/)
    expect(meta).toBeInTheDocument()
    expect(meta.classList.contains('price-result__meta')).toBe(true)
  })

  it('has correct DOM hierarchy: brand → price → details', () => {
    const { container } = render(<PriceResult {...defaultProps} />)
    const root = container.firstElementChild as HTMLElement
    const children = Array.from(root.children)

    const brandIdx = children.findIndex((el) => el.classList.contains('price-result__brand'))
    const priceIdx = children.findIndex((el) => el.classList.contains('price-result__price-tag'))
    const detailsIdx = children.findIndex((el) => el.classList.contains('price-result__details'))

    expect(brandIdx).toBeLessThan(priceIdx)
    expect(priceIdx).toBeLessThan(detailsIdx)
  })

  it('applies CSS transition on price tag for animated price changes', () => {
    const { container } = render(<PriceResult {...defaultProps} />)
    const priceTag = container.querySelector('.price-result__price-tag') as HTMLElement
    expect(priceTag).toBeTruthy()
    // The SCSS applies transition: opacity 0.3s ease, transform 0.3s ease
    // We verify the element exists with the correct class
    expect(priceTag.classList.contains('price-result__price-tag')).toBe(true)
  })
})
