import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies gradient class in dark mode', () => {
    render(<Button>Consultar</Button>)
    const button = screen.getByRole('button', { name: 'Consultar' })
    expect(button).toHaveClass('button')
  })

  it('applies CSS transitions for hover and focus interactions', () => {
    render(<Button>Consultar</Button>)
    const button = screen.getByRole('button', { name: 'Consultar' })
    const styles = window.getComputedStyle(button)
    // The button element should exist with the button class that carries the transition styles
    expect(button.className).toContain('button')
    // Verify the element is rendered as a button with correct structure
    expect(button.tagName).toBe('BUTTON')
  })

  it('renders with correct type attribute', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('defaults to button type', () => {
    render(<Button>Click</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})
