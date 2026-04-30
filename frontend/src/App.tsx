import { useState } from 'react'
import type { FormEvent } from 'react'

interface PriceResult {
  productId: number
  brandId: number
  priceList: number
  startDate: string
  endDate: string
  price: number
  currency: string
}

interface ApiError {
  status: number
  error: string
  message: string
  timestamp: string
}

type QueryState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; data: PriceResult }
  | { kind: 'error'; error: ApiError }
  | { kind: 'network-error'; message: string }

function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return isoString
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount)
}

function App() {
  const [date, setDate] = useState('2020-06-14T10:00')
  const [productId, setProductId] = useState('35455')
  const [brandId, setBrandId] = useState('1')
  const [state, setState] = useState<QueryState>({ kind: 'idle' })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setState({ kind: 'loading' })

    const params = new URLSearchParams({
      date: date.includes('T') ? date + ':00' : date,
      productId,
      brandId,
    })

    try {
      const response = await fetch(`/api/prices?${params}`)

      if (response.ok) {
        const data: PriceResult = await response.json()
        setState({ kind: 'success', data })
      } else {
        const error: ApiError = await response.json()
        setState({ kind: 'error', error })
      }
    } catch {
      setState({
        kind: 'network-error',
        message: 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Pricing Service</h1>
          <p className="mt-1 text-sm text-gray-600">
            Consulta de precios aplicables por producto, marca y fecha
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          aria-label="Formulario de consulta de precios"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Parámetros de consulta</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de aplicación
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                ID de Producto
              </label>
              <input
                type="number"
                id="productId"
                name="productId"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
                min="1"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 mb-1">
                ID de Marca
              </label>
              <input
                type="number"
                id="brandId"
                name="brandId"
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                required
                min="1"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={state.kind === 'loading'}
              className="w-full sm:w-auto rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {state.kind === 'loading' ? 'Consultando…' : 'Consultar precio'}
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="mt-6" aria-live="polite">
          {state.kind === 'loading' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <p className="text-sm text-gray-600">Buscando precio aplicable…</p>
            </div>
          )}

          {state.kind === 'success' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-green-50 border-b border-green-200 px-6 py-3">
                <h2 className="text-sm font-semibold text-green-800">Precio encontrado</h2>
              </div>
              <div className="p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID de Producto</dt>
                    <dd className="mt-0.5 text-sm text-gray-900">{state.data.productId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID de Marca</dt>
                    <dd className="mt-0.5 text-sm text-gray-900">{state.data.brandId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tarifa (Price List)</dt>
                    <dd className="mt-0.5 text-sm text-gray-900">{state.data.priceList}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Precio final</dt>
                    <dd className="mt-0.5 text-lg font-semibold text-gray-900">
                      {formatPrice(state.data.price, state.data.currency)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fecha de inicio</dt>
                    <dd className="mt-0.5 text-sm text-gray-900">
                      {formatDateTime(state.data.startDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fecha de fin</dt>
                    <dd className="mt-0.5 text-sm text-gray-900">
                      {formatDateTime(state.data.endDate)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {state.kind === 'error' && (
            <div
              className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden"
              role="alert"
            >
              <div className="bg-red-50 border-b border-red-200 px-6 py-3">
                <h2 className="text-sm font-semibold text-red-800">
                  {state.error.status === 404 ? 'Precio no encontrado' : 'Parámetros inválidos'}
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700">{state.error.message}</p>
              </div>
            </div>
          )}

          {state.kind === 'network-error' && (
            <div
              className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden"
              role="alert"
            >
              <div className="bg-red-50 border-b border-red-200 px-6 py-3">
                <h2 className="text-sm font-semibold text-red-800">Error de conexión</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700">{state.message}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-3xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-gray-400">
          Pricing Service — Arquitectura Hexagonal · Spring Boot · React · TypeScript
        </p>
      </footer>
    </div>
  )
}

export default App
