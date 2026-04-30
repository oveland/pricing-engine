import type { PriceResponse, ApiErrorResponse, PriceSearchParams } from '../types/price.types'
import { toIsoDateTime } from '../utils/formatters'

const API_BASE = '/api/prices'

export type PriceServiceResult =
  | { ok: true; data: PriceResponse }
  | { ok: false; error: ApiErrorResponse }

export async function fetchApplicablePrice(params: PriceSearchParams): Promise<PriceServiceResult> {
  const searchParams = new URLSearchParams({
    date: toIsoDateTime(params.date),
    productId: params.productId,
    brandId: params.brandId,
  })

  const response = await fetch(`${API_BASE}?${searchParams}`)

  if (response.ok) {
    const data: PriceResponse = await response.json()
    return { ok: true, data }
  }

  const error: ApiErrorResponse = await response.json()
  return { ok: false, error }
}
