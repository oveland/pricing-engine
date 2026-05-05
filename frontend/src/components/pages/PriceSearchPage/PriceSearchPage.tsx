import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { usePriceSearch } from '../../../hooks/usePriceSearch'
import { useGsapAnimation } from '../../../hooks/useGsapAnimation'
import { PriceSearchForm } from '../../organisms/PriceSearchForm/PriceSearchForm'
import { PriceResult } from '../../molecules/PriceResult/PriceResult'
import { ErrorMessage } from '../../molecules/ErrorMessage/ErrorMessage'
import { LoadingSpinner } from '../../atoms/LoadingSpinner/LoadingSpinner'
import './PriceSearchPage.scss'

export function PriceSearchPage() {
  const {
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
  } = usePriceSearch()

  const { containerRef, contextRef } = useGsapAnimation({ respectReducedMotion: true })

  useLayoutEffect(() => {
    if (!contextRef.current || !containerRef.current) return

    contextRef.current.add(() => {
      const elements = containerRef.current!.querySelectorAll('[data-animate]')
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
      )
    })
  }, [contextRef, containerRef])

  return (
    <div ref={containerRef} className="price-search-page">
      <div className="price-search-page__content max-w-2xl mx-auto py-16 px-6 space-y-12">
        {/* BrandHeader — sección semántica con identidad de marca */}
        <header data-animate className="price-search-page__header text-center">
          <h1 className="price-search-page__brand-name">MOTOR DE PRECIOS</h1>
          <p className="price-search-page__tagline">
            Colección Primavera/Verano 2020 — Consulta de tarifas
          </p>
        </header>

        {/* PriceSearchForm con slider temporal */}
        <div data-animate>
          <PriceSearchForm
            date={date}
            productId={productId}
            brandId={brandId}
            loading={state.kind === 'loading'}
            onDateChange={setDate}
            onProductIdChange={setProductId}
            onBrandIdChange={setBrandId}
            onSubmit={search}
            sliderValue={sliderValue}
            onSliderChange={setSliderValue}
            sliderMarkers={sliderMarkers}
          />
        </div>

        {/* Zona de resultados con aria-live para accesibilidad */}
        <div aria-live="polite">
          {state.kind === 'loading' && <LoadingSpinner />}
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

        {/* Footer */}
        <footer data-animate className="price-search-page__footer text-center">
          <p>Pricing Engine — Arquitectura Hexagonal · Spring Boot · React · TypeScript</p>
        </footer>
      </div>
    </div>
  )
}
