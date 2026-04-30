export interface PriceResponse {
  productId: number
  brandId: number
  priceList: number
  startDate: string
  endDate: string
  price: number
  currency: string
}

export interface ApiErrorResponse {
  status: number
  error: string
  message: string
  timestamp: string
}

export type QueryState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; data: PriceResponse }
  | { kind: 'error'; error: ApiErrorResponse }
  | { kind: 'network-error'; message: string }

export interface PriceSearchParams {
  date: string
  productId: string
  brandId: string
}
