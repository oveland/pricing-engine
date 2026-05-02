import { render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'

const mockRevert = vi.fn()
const mockContext = { revert: mockRevert }

vi.mock('gsap', () => ({
  default: {
    context: vi.fn(() => mockContext),
  },
}))

import gsap from 'gsap'
import { useGsapAnimation } from '../useGsapAnimation'

/**
 * Componente auxiliar que usa el hook y asigna containerRef a un div real.
 * Esto garantiza que useLayoutEffect se ejecute con el ref correctamente asignado.
 */
function TestComponent({ respectReducedMotion }: { respectReducedMotion?: boolean }) {
  const { containerRef } = useGsapAnimation(
    respectReducedMotion !== undefined ? { respectReducedMotion } : undefined,
  )
  return React.createElement('div', { ref: containerRef, 'data-testid': 'container' })
}

describe('useGsapAnimation', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    vi.clearAllMocks()
    originalMatchMedia = window.matchMedia
    // Default: reduced motion not active
    window.matchMedia = vi.fn().mockReturnValue({ matches: false })
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('crea gsap.context() vinculado al containerRef', () => {
    render(React.createElement(TestComponent))

    expect(gsap.context).toHaveBeenCalledTimes(1)
    // Verifica que se llamó con una función y el elemento DOM del contenedor
    expect(gsap.context).toHaveBeenCalledWith(expect.any(Function), expect.any(HTMLDivElement))
  })

  it('expone containerRef y contextRef', () => {
    const { result } = renderHook(() => useGsapAnimation())

    expect(result.current.containerRef).toBeDefined()
    expect(result.current.contextRef).toBeDefined()
    expect(result.current.containerRef.current).toBeNull() // sin DOM real en renderHook
  })

  it('llama context.revert() al desmontar el componente', () => {
    const { unmount } = render(React.createElement(TestComponent))

    expect(gsap.context).toHaveBeenCalledTimes(1)

    unmount()

    expect(mockRevert).toHaveBeenCalledTimes(1)
  })

  it('no crea animaciones cuando prefers-reduced-motion: reduce está activo', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })

    render(React.createElement(TestComponent, { respectReducedMotion: true }))

    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
    expect(gsap.context).not.toHaveBeenCalled()
  })

  it('crea animaciones cuando prefers-reduced-motion: no-preference', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false })

    render(React.createElement(TestComponent, { respectReducedMotion: true }))

    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
    expect(gsap.context).toHaveBeenCalledTimes(1)
  })

  it('no consulta matchMedia cuando respectReducedMotion es false', () => {
    render(React.createElement(TestComponent, { respectReducedMotion: false }))

    expect(window.matchMedia).not.toHaveBeenCalled()
    expect(gsap.context).toHaveBeenCalledTimes(1)
  })

  it('no consulta matchMedia cuando no se pasan opciones', () => {
    render(React.createElement(TestComponent))

    expect(window.matchMedia).not.toHaveBeenCalled()
    expect(gsap.context).toHaveBeenCalledTimes(1)
  })
})
