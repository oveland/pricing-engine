import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ErrorMessage } from './ErrorMessage'

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

describe('ErrorMessage', () => {
  it('applies glassmorphism class to container', () => {
    const { container } = render(<ErrorMessage title="Error" message="Something went wrong" />)
    const root = container.firstElementChild as HTMLElement
    expect(root.classList.contains('glassmorphism')).toBe(true)
    expect(root.classList.contains('error-message')).toBe(true)
  })

  it('executes GSAP shake animation on mount', () => {
    render(<ErrorMessage title="Error" message="Something went wrong" />)
    expect(mockFromTo).toHaveBeenCalled()
    const [, , toVars] = mockFromTo.mock.calls[0]
    expect(toVars).toEqual(
      expect.objectContaining({
        keyframes: expect.arrayContaining([
          expect.objectContaining({ x: -10 }),
          expect.objectContaining({ x: 10 }),
          expect.objectContaining({ x: 0 }),
        ]),
      })
    )
  })

  it('renders title and message', () => {
    render(<ErrorMessage title="Error" message="Something went wrong" />)
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('has alert role for accessibility', () => {
    render(<ErrorMessage title="Error" message="Oops" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
