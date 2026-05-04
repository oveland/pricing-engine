import { useState, useEffect, useRef, useCallback } from 'react'
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

  const debouncedSliderValue = useDebounce(sliderValue, 200)
  const isInitialMount = useRef(true)
  const shouldAutoSearch = useRef(false)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    shouldAutoSearch.current = true
    setDate(timestampToDateTimeLocal(debouncedSliderValue) + ':00')
  }, [debouncedSliderValue])

  useEffect(() => {
    if (!shouldAutoSearch.current) return
    shouldAutoSearch.current = false

    let cancelled = false

    async function fetchPrice() {
      setState({ kind: 'loading' })

      try {
        const result = await fetchApplicablePrice({ date, productId, brandId })

        if (cancelled) return

        if (result.ok) {
          setState({ kind: 'success', data: result.data })
        } else {
          setState({ kind: 'error', error: result.error })
        }
      } catch {
        if (!cancelled) {
          setState({ kind: 'network-error', message: NETWORK_ERROR_MESSAGE })
        }
      }
    }

    fetchPrice()

    return () => {
      cancelled = true
    }
  }, [date, productId, brandId])

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
    setSliderValue,
    sliderMarkers,
  }
}
