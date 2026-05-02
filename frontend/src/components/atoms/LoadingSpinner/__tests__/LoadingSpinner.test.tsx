import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockRevert, mockAdd, mockTo } = vi.hoisted(() => ({
  mockRevert: vi.fn(),
  mockAdd: vi.fn((fn: () => void) => fn()),
  mockTo: vi.fn(),
}))

vi.mock('gsap', () => ({
  default: {
    context: vi.fn(() => ({ revert: mockRevert, add: mockAdd })),
    to: mockTo,
  },
}))

import { LoadingSpinner } from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
    originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn().mockReturnValue({ matches: false })
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('renders with role="status" and accessible text "Cargando"', () => {
    render(<LoadingSpinner />)

    const statusElement = screen.getByRole('status')
    expect(statusElement).toBeInTheDocument()
    expect(statusElement).toHaveTextContent('Cargando')

    const srText = statusElement.querySelector('.sr-only')
    expect(srText).toBeInTheDocument()
    expect(srText).toHaveTextContent('Cargando')
  })

  it('accepts custom label prop for accessible text', () => {
    render(<LoadingSpinner label="Buscando precio" />)

    const statusElement = screen.getByRole('status')
    expect(statusElement).toHaveTextContent('Buscando precio')

    const srText = statusElement.querySelector('.sr-only')
    expect(srText).toHaveTextContent('Buscando precio')
  })

  it('creates GSAP animation on mount', () => {
    render(<LoadingSpinner />)

    expect(mockTo).toHaveBeenCalledWith(
      expect.any(Element),
      expect.objectContaining({
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: 'linear',
      }),
    )
  })

  it('cleans up GSAP animation on unmount', () => {
    const { unmount } = render(<LoadingSpinner />)

    unmount()

    expect(mockRevert).toHaveBeenCalled()
  })
})
