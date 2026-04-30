import { usePriceSearch } from '../../../hooks/usePriceSearch'
import { PriceSearchForm } from '../../organisms/PriceSearchForm/PriceSearchForm'
import { PriceResult } from '../../molecules/PriceResult/PriceResult'
import { ErrorMessage } from '../../molecules/ErrorMessage/ErrorMessage'
import './PriceSearchPage.scss'

export function PriceSearchPage() {
  const { date, productId, brandId, state, setDate, setProductId, setBrandId, search } =
    usePriceSearch()

  return (
    <div className="price-search-page">
      <header className="price-search-page__header">
        <div className="price-search-page__header-content">
          <h1 className="price-search-page__title">Pricing Service</h1>
          <p className="price-search-page__subtitle">
            Consulta de precios aplicables por producto, marca y fecha
          </p>
        </div>
      </header>

      <main className="price-search-page__main">
        <PriceSearchForm
          date={date}
          productId={productId}
          brandId={brandId}
          loading={state.kind === 'loading'}
          onDateChange={setDate}
          onProductIdChange={setProductId}
          onBrandIdChange={setBrandId}
          onSubmit={search}
        />

        <div className="price-search-page__results" aria-live="polite">
          {state.kind === 'loading' && (
            <p className="price-search-page__loading">Buscando precio aplicable…</p>
          )}

          {state.kind === 'success' && <PriceResult {...state.data} />}

          {state.kind === 'error' && (
            <ErrorMessage
              title={state.error.status === 404 ? 'Precio no encontrado' : 'Parámetros inválidos'}
              message={state.error.message}
            />
          )}

          {state.kind === 'network-error' && (
            <ErrorMessage title="Error de conexión" message={state.message} />
          )}
        </div>
      </main>

      <footer className="price-search-page__footer">
        <p>Pricing Service — Arquitectura Hexagonal · Spring Boot · React · TypeScript</p>
      </footer>
    </div>
  )
}
