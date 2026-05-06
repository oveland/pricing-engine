import { useState, useCallback } from 'react'
import type { QueryState, SliderMarker } from '../types/price.types'
import { fetchApplicablePrice } from '../services/price.service'
import {
  SLIDER_MIN_TIMESTAMP,
  PRICE_TRANSITION_MARKERS,
  timestampToDateTimeLocal,
} from '../utils/slider.utils'

const NETWORK_ERROR_MESSAGE =
  'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.'

export function usePriceSearch() {
  const [date, setDate] = useState('2020-06-14T10:00')
  const [productId, setProductId] = useState('35455')
  const [brandId, setBrandId] = useState('1')
  const [state, setState] = useState<QueryState>({ kind: 'idle' })
  const [sliderValue, setSliderValue] = useState(SLIDER_MIN_TIMESTAMP)

  /** Actualiza el preview de fecha mientras se arrastra el slider (sin consulta) */
  const handleSliderChange = useCallback((timestamp: number) => {
    setSliderValue(timestamp)
    setDate(timestampToDateTimeLocal(timestamp) + ':00')
  }, [])

  /** Al soltar el slider, dispara la consulta al backend */
  const handleSliderChangeEnd = useCallback(
    async (timestamp: number) => {
      const newDate = timestampToDateTimeLocal(timestamp) + ':00'
      setDate(newDate)

      setState({ kind: 'loading' })

      try {
        const result = await fetchApplicablePrice({ date: newDate, productId, brandId })

        if (result.ok) {
          setState({ kind: 'success', data: result.data })
        } else {
          setState({ kind: 'error', error: result.error })
        }
      } catch {
        setState({ kind: 'network-error', message: NETWORK_ERROR_MESSAGE })
      }
    },
    [productId, brandId],
  )

  const search = useCallback(async () => {
    setState({ kind: 'loading' })

    try {
      const result = await fetchApplicablePrice({ date, productId, brandId })

      if (result.ok) {
        setState({ kind: 'success', data: result.data })
      } else {
        setState({ kind: 'error', error: result.error })
      }
    } catch {
      setState({ kind: 'network-error', message: NETWORK_ERROR_MESSAGE })
    }
  }, [date, productId, brandId])

  const sliderMarkers: SliderMarker[] = PRICE_TRANSITION_MARKERS

  return {
    date,
    productId,
    brandId,
    state,
    setDate,
    setProductId,
    setBrandId,
    search,
    sliderValue,
    handleSliderChange,
    handleSliderChangeEnd,
    sliderMarkers,
  }
}
