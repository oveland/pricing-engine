import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ErrorMessage } from './ErrorMessage'

describe('ErrorMessage', () => {
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
