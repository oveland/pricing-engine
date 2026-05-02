import './TemporalSlider.scss'

import { SLIDER_MIN_TIMESTAMP, SLIDER_MAX_TIMESTAMP, timestampToPercent } from '../../../utils/slider.utils'
import { formatSliderDate } from '../../../utils/formatters'
import type { SliderMarker } from '../../../types/price.types'

export interface TemporalSliderProps {
  /** Valor actual como timestamp en milisegundos */
  value: number
  /** Callback al cambiar el valor del slider */
  onChange: (timestamp: number) => void
  /** Marcadores de transición de precios */
  markers: SliderMarker[]
  /** Si el slider está deshabilitado (durante carga) */
  disabled?: boolean
}

export function TemporalSlider({ value, onChange, markers, disabled = false }: TemporalSliderProps) {
  const readableDate = formatSliderDate(value)

  return (
    <div className="temporal-slider">
      <div className="temporal-slider__header">
        <span className="temporal-slider__label">Explorar precios por fecha</span>
        <span className="temporal-slider__date" aria-live="polite">
          {readableDate}
        </span>
      </div>

      <div className="temporal-slider__track-container">
        <input
          type="range"
          className="temporal-slider__input"
          min={SLIDER_MIN_TIMESTAMP}
          max={SLIDER_MAX_TIMESTAMP}
          step={60000}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Selector de fecha temporal"
          aria-valuetext={readableDate}
          aria-valuemin={SLIDER_MIN_TIMESTAMP}
          aria-valuemax={SLIDER_MAX_TIMESTAMP}
        />

        <div className="temporal-slider__markers">
          {markers.map((marker) => (
            <div
              key={marker.timestamp}
              className="temporal-slider__marker"
              style={{ left: `${timestampToPercent(marker.timestamp)}%` }}
              title={marker.label}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
