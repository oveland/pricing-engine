import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { PriceSearchForm } from './PriceSearchForm'
import { SLIDER_MIN_TIMESTAMP, PRICE_TRANSITION_MARKERS } from '../../../utils/slider.utils'

describe('PriceSearchForm', () => {
  const defaultProps = {
    date: '2020-06-14T10:00',
    productId: '35455',
    brandId: '1',
    loading: false,
    onDateChange: vi.fn(),
    onProductIdChange: vi.fn(),
    onBrandIdChange: vi.fn(),
    onSubmit: vi.fn(),
    sliderValue: SLIDER_MIN_TIMESTAMP,
    onSliderChange: vi.fn(),
    sliderMarkers: PRICE_TRANSITION_MARKERS,
  }

  it('renders all three input fields and submit button', () => {
    render(<PriceSearchForm {...defaultProps} />)

    expect(screen.getByLabelText(/fecha de aplicación/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/id de producto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/id de marca/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /consultar precio/i })).toBeInTheDocument()
  })

  it('calls onSubmit when form is submitted', async () => {
    render(<PriceSearchForm {...defaultProps} />)

    await userEvent.click(screen.getByRole('button', { name: /consultar precio/i }))
    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })

  it('shows loading text when loading is true', () => {
    render(<PriceSearchForm {...defaultProps} loading={true} />)

    expect(screen.getByRole('button', { name: /consultando/i })).toBeDisabled()
  })

  it('integrates TemporalSlider below existing fields', () => {
    render(<PriceSearchForm {...defaultProps} />)

    expect(screen.getByRole('slider', { name: /selector de fecha temporal/i })).toBeInTheDocument()
  })

  it('maintains existing props and form functionality (backward compatibility)', async () => {
    const props = { ...defaultProps, onSubmit: vi.fn(), onDateChange: vi.fn() }
    render(<PriceSearchForm {...props} />)

    // Form fields still render with correct values
    expect(screen.getByLabelText(/fecha de aplicación/i)).toHaveValue('2020-06-14T10:00')
    expect(screen.getByLabelText(/id de producto/i)).toHaveValue(35455)
    expect(screen.getByLabelText(/id de marca/i)).toHaveValue(1)

    // Submit still works
    await userEvent.click(screen.getByRole('button', { name: /consultar precio/i }))
    expect(props.onSubmit).toHaveBeenCalledTimes(1)
  })

  it('passes disabled to slider when loading is true', () => {
    render(<PriceSearchForm {...defaultProps} loading={true} />)

    expect(screen.getByRole('slider', { name: /selector de fecha temporal/i })).toBeDisabled()
  })
})
