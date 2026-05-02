import { useState, useEffect, useRef } from 'react'
import type { QueryState, SliderMarker } from '../types/price.types'
import { fetchApplicablePrice } from '../services/price.service'
import { useDebounce } from './useDebounce'
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

  const debouncedSliderValue = useDebounce(sliderValue, 500)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    setDate(timestampToDateTimeLocal(debouncedSliderValue) + ':00')
    search()
  }, [debouncedSliderValue])

  async function search() {
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
  }

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
    setSliderValue,
    sliderMarkers,
  }
}
