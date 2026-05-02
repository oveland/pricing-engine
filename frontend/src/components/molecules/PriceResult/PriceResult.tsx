import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import type { PriceResponse } from '../../../types/price.types'
import { formatPriceTag, formatDateTime } from '../../../utils/formatters'
import { useGsapAnimation } from '../../../hooks/useGsapAnimation'
import './PriceResult.scss'

export function PriceResult(props: PriceResponse) {
  const { containerRef, contextRef } = useGsapAnimation({ respectReducedMotion: true })
  const priceParts = formatPriceTag(props.price, props.currency)
  const brandName = props.brandId === 1 ? 'ZARA' : `Marca ${props.brandId}`

  useLayoutEffect(() => {
    if (!contextRef.current || !containerRef.current) return
    contextRef.current.add(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' }
      )
    })
  }, [contextRef, containerRef])

  return (
    <div ref={containerRef} className="price-result glassmorphism">
      <span className="price-result__brand">{brandName}</span>

      <div className="price-result__price-tag">
        <span className="price-result__price-integer">{priceParts.integer}</span>
        <span className="price-result__price-decimal">,{priceParts.decimal}</span>
        <span className="price-result__price-currency"> {priceParts.currency}</span>
      </div>

      <div className="price-result__details">
        <span className="price-result__meta">
          Producto {props.productId} · Tarifa {props.priceList}
        </span>
        <span className="price-result__dates">
          {formatDateTime(props.startDate)} — {formatDateTime(props.endDate)}
        </span>
      </div>
    </div>
  )
}
