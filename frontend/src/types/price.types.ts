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

/** Marcador visual de transición de precios en el slider */
export interface SliderMarker {
  /** Timestamp en milisegundos del límite de transición */
  timestamp: number
  /** Etiqueta descriptiva (ej: "Inicio tarifa 2 — 25.45€") */
  label: string
}

/** Partes desglosadas del precio para Price Tag Display */
export interface PriceTagParts {
  /** Parte entera del precio (ej: "35") */
  integer: string
  /** Parte decimal del precio (ej: "50") */
  decimal: string
  /** Símbolo de moneda (ej: "€") */
  currency: string
}
