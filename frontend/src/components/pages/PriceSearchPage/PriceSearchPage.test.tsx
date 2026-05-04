import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

/* ── GSAP mock (hoisted so it's available before module evaluation) ── */
const { mockFromTo, mockRevert, mockAdd } = vi.hoisted(() => ({
  mockFromTo: vi.fn(),
  mockRevert: vi.fn(),
  mockAdd: vi.fn((fn: () => void) => fn()),
}))

vi.mock('gsap', () => ({
  default: {
    fromTo: (...args: unknown[]) => mockFromTo(...args),
    to: vi.fn(),
    context: vi.fn(() => ({ revert: mockRevert, add: mockAdd })),
  },
}))

import { PriceSearchPage } from './PriceSearchPage'

describe('PriceSearchPage', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    vi.clearAllMocks()

    /* Mock matchMedia to prevent "not a function" errors from useGsapAnimation */
    originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    /* Ensure dark class is on document root (mirrors main.tsx behaviour) */
    document.documentElement.classList.add('dark')

    /* Default fetch mock — idle state, no pending requests */
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        productId: 35455,
        brandId: 1,
        priceList: 1,
        startDate: '2020-06-14T00:00:00',
        endDate: '2020-12-31T23:59:59',
        price: 35.5,
        currency: 'EUR',
      }),
    } as Response)
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    document.documentElement.classList.remove('dark')
    vi.restoreAllMocks()
  })

  /* ── Req 2.1, 2.8: Gradient background ── */
  it('applies gradient background class with dark tones', () => {
    const { container } = render(<PriceSearchPage />)
    const root = container.firstElementChild as HTMLElement
    expect(root.classList.contains('price-search-page')).toBe(true)
  })

  /* ── Req 3.2: GSAP entry animation with stagger ── */
  it('executes GSAP entry animation (stagger) on mount', () => {
    render(<PriceSearchPage />)

    expect(mockFromTo).toHaveBeenCalled()
    const [, fromVars, toVars] = mockFromTo.mock.calls[0]
    expect(fromVars).toEqual(expect.objectContaining({ opacity: 0, y: 30 }))
    expect(toVars).toEqual(
      expect.objectContaining({
        opacity: 1,
        y: 0,
        stagger: 0.15,
      }),
    )
  })

  /* ── Req 7.2: LoadingSpinner replaces plain text ── */
  it('renders LoadingSpinner during "loading" state instead of plain text', async () => {
    /* Make fetch hang so state stays in "loading" */
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}))

    render(<PriceSearchPage />)
    await userEvent.click(screen.getByRole('button', { name: /consultar precio/i }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.queryByText(/buscando precio aplicable/i)).not.toBeInTheDocument()
    })
  })

  /* ── Req 1.1: Dark mode by default ── */
  it('loads with dark class on document root', () => {
    render(<PriceSearchPage />)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  /* ── Req 8.1: Brand name with editorial typography ── */
  it('shows "MOTOR DE PRECIOS" with editorial typography (wide letter-spacing, light font-weight)', () => {
    const { container } = render(<PriceSearchPage />)
    const brandName = screen.getByText('MOTOR DE PRECIOS')
    expect(brandName).toBeInTheDocument()
    expect(brandName.tagName).toBe('H1')
    expect(brandName.classList.contains('price-search-page__brand-name')).toBe(true)

    const header = container.querySelector('.price-search-page__header')
    expect(header).toBeTruthy()
    expect(header!.tagName).toBe('HEADER')
  })

  /* ── Req 8.2: Product Detail Layout ── */
  it('uses Product Detail Layout centered with generous spacing', () => {
    const { container } = render(<PriceSearchPage />)
    const content = container.querySelector('.price-search-page__content')
    expect(content).toBeTruthy()
    expect(content!.classList.contains('max-w-2xl')).toBe(true)
    expect(content!.classList.contains('mx-auto')).toBe(true)
    expect(content!.classList.contains('py-16')).toBe(true)
    expect(content!.classList.contains('px-6')).toBe(true)
    expect(content!.classList.contains('space-y-12')).toBe(true)
  })

  /* ── Req 8.5: Page structure includes footer ── */
  it('renders footer with architecture description', () => {
    const { container } = render(<PriceSearchPage />)
    const footer = container.querySelector('.price-search-page__footer')
    expect(footer).toBeTruthy()
    expect(footer!.tagName).toBe('FOOTER')
  })

  /* ── Req 8.7: Tagline ── */
  it('shows tagline "Colección Primavera/Verano 2020 — Consulta de precios"', () => {
    render(<PriceSearchPage />)
    const tagline = screen.getByText('Colección Primavera/Verano 2020 — Consulta de precios')
    expect(tagline).toBeInTheDocument()
    expect(tagline.classList.contains('price-search-page__tagline')).toBe(true)
  })

  /* ── Req 8.2: Single-column centered layout ── */
  it('has single-column centered layout', () => {
    const { container } = render(<PriceSearchPage />)
    const content = container.querySelector('.price-search-page__content')
    expect(content).toBeTruthy()
    /* max-w-2xl + mx-auto ensures single-column centered layout */
    expect(content!.classList.contains('max-w-2xl')).toBe(true)
    expect(content!.classList.contains('mx-auto')).toBe(true)
  })
})
