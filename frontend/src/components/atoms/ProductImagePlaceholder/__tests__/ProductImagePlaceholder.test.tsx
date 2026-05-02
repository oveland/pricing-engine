import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProductImagePlaceholder } from '../ProductImagePlaceholder'

describe('ProductImagePlaceholder', () => {
  it('renders container with aspect-ratio 3:4 (portrait)', () => {
    const { container } = render(<ProductImagePlaceholder />)

    const placeholder = container.querySelector('.product-image-placeholder')
    expect(placeholder).toBeInTheDocument()
    expect((placeholder as HTMLElement).style.aspectRatio).toBe('3 / 4')
  })

  it('contains subtle SVG icon', () => {
    const { container } = render(<ProductImagePlaceholder />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies subtle glassmorphism styles', () => {
    const { container } = render(<ProductImagePlaceholder />)

    const placeholder = container.querySelector('.product-image-placeholder')
    expect(placeholder).toBeInTheDocument()

    expect(placeholder).toHaveClass('bg-white/[0.03]')
    expect(placeholder).toHaveClass('border')
    expect(placeholder).toHaveClass('border-white/[0.06]')
    expect(placeholder).toHaveClass('rounded-xl')
    expect(placeholder).toHaveClass('max-w-sm')
  })

  it('accepts additional className prop for customization', () => {
    const { container } = render(<ProductImagePlaceholder className="mt-8 custom-class" />)

    const placeholder = container.querySelector('.product-image-placeholder')
    expect(placeholder).toHaveClass('mt-8')
    expect(placeholder).toHaveClass('custom-class')
  })
})
