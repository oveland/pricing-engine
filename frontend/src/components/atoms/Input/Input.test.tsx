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
})
