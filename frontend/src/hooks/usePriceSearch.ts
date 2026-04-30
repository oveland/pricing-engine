import { useState } from 'react'
import type { QueryState } from '../types/price.types'
import { fetchApplicablePrice } from '../services/price.service'

const NETWORK_ERROR_MESSAGE =
  'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.'

export function usePriceSearch() {
  const [date, setDate] = useState('2020-06-14T10:00')
  const [productId, setProductId] = useState('35455')
  const [brandId, setBrandId] = useState('1')
  const [state, setState] = useState<QueryState>({ kind: 'idle' })

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

  return {
    date,
    productId,
    brandId,
    state,
    setDate,
    setProductId,
    setBrandId,
    search,
  }
}
