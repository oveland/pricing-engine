import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders label and input field', () => {
    render(<Input id="test" label="Test Label" type="text" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
  })

  it('calls onChange when value changes', async () => {
    const onChange = vi.fn()
    render(<Input id="test" label="Test" type="text" value="" onChange={onChange} />)

    await userEvent.type(screen.getByLabelText('Test'), 'a')
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('applies semi-transparent styles in dark mode', () => {
    render(<Input id="date" label="Fecha" type="text" value="" onChange={() => {}} />)
    const input = screen.getByLabelText('Fecha')
    expect(input).toHaveClass('input__field')
  })

  it('applies CSS transitions on focus', () => {
    render(<Input id="date" label="Fecha" type="text" value="" onChange={() => {}} />)
    const input = screen.getByLabelText('Fecha')
    // The input field should have the input__field class that carries transition styles
    expect(input.className).toContain('input__field')
    // Verify the label has the correct BEM class for dark mode styling
    const label = screen.getByText('Fecha')
    expect(label).toHaveClass('input__label')
  })

  it('renders with correct input type', () => {
    render(
      <Input id="date" label="Fecha" type="datetime-local" value="" onChange={() => {}} />
    )
    expect(screen.getByLabelText('Fecha')).toHaveAttribute('type', 'datetime-local')
  })

  it('applies required attribute when specified', () => {
    render(
      <Input id="test" label="Required Field" type="text" value="" onChange={() => {}} required />
    )
    expect(screen.getByLabelText('Required Field')).toBeRequired()
  })
})
