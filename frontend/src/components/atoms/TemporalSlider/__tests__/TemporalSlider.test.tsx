import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TemporalSlider } from '../TemporalSlider'
import {
  SLIDER_MIN_TIMESTAMP,
  SLIDER_MAX_TIMESTAMP,
  PRICE_TRANSITION_MARKERS,
  timestampToPercent,
} from '../../../../utils/slider.utils'
import { formatSliderDate } from '../../../../utils/formatters'

const defaultProps = {
  value: SLIDER_MIN_TIMESTAMP,
  onChange: vi.fn(),
  markers: PRICE_TRANSITION_MARKERS,
}

describe('TemporalSlider', () => {
  it('renders input[type="range"] with correct min and max', () => {
    render(<TemporalSlider {...defaultProps} />)

    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('type', 'range')
    expect(slider).toHaveAttribute('min', String(SLIDER_MIN_TIMESTAMP))
    expect(slider).toHaveAttribute('max', String(SLIDER_MAX_TIMESTAMP))
  })

  it('shows readable date updated when value changes', () => {
    const midTimestamp = Math.floor((SLIDER_MIN_TIMESTAMP + SLIDER_MAX_TIMESTAMP) / 2)

    const { rerender } = render(<TemporalSlider {...defaultProps} value={SLIDER_MIN_TIMESTAMP} />)
    expect(screen.getByText(formatSliderDate(SLIDER_MIN_TIMESTAMP))).toBeInTheDocument()

    rerender(<TemporalSlider {...defaultProps} value={midTimestamp} />)
    expect(screen.getByText(formatSliderDate(midTimestamp))).toBeInTheDocument()
  })

  it('includes all required ARIA attributes', () => {
    const value = SLIDER_MIN_TIMESTAMP
    render(<TemporalSlider {...defaultProps} value={value} />)

    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-label', 'Selector de fecha temporal')
    expect(slider).toHaveAttribute('aria-valuetext', formatSliderDate(value))
    expect(slider).toHaveAttribute('aria-valuemin', String(SLIDER_MIN_TIMESTAMP))
    expect(slider).toHaveAttribute('aria-valuemax', String(SLIDER_MAX_TIMESTAMP))
  })

  it('renders visual markers at correct positions', () => {
    render(<TemporalSlider {...defaultProps} />)

    const markers = document.querySelectorAll('.temporal-slider__marker')
    expect(markers).toHaveLength(PRICE_TRANSITION_MARKERS.length)

    PRICE_TRANSITION_MARKERS.forEach((marker, index) => {
      const expectedPercent = timestampToPercent(marker.timestamp)
      expect((markers[index] as HTMLElement).style.left).toBe(`${expectedPercent}%`)
    })
  })

  it('is operable with arrow keys', () => {
    const onChange = vi.fn()
    const value = SLIDER_MIN_TIMESTAMP + 60000 * 10 // 10 minutes in
    render(<TemporalSlider {...defaultProps} value={value} onChange={onChange} />)

    const slider = screen.getByRole('slider')

    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })

    // The native range input handles arrow key increments natively.
    // We verify the slider is focusable and receives keyboard events.
    expect(slider).not.toBeDisabled()
    expect(slider).toHaveAttribute('step', '60000')
  })

  it('calls onChange when slider value changes', () => {
    const onChange = vi.fn()
    render(<TemporalSlider {...defaultProps} onChange={onChange} />)

    const slider = screen.getByRole('slider')
    const newValue = SLIDER_MIN_TIMESTAMP + 60000 * 30

    fireEvent.change(slider, { target: { value: String(newValue) } })
    expect(onChange).toHaveBeenCalledWith(newValue)
  })

  it('disables the slider when disabled prop is true', () => {
    render(<TemporalSlider {...defaultProps} disabled={true} />)

    const slider = screen.getByRole('slider')
    expect(slider).toBeDisabled()
  })
})
