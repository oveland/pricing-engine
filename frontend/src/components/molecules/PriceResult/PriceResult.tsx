import type { PriceResponse } from '../../../types/price.types'
import { formatDateTime, formatPrice } from '../../../utils/formatters'
import './PriceResult.scss'

export function PriceResult(props: PriceResponse) {
  return (
    <div className="price-result">
      <div className="price-result__header">
        <h2 className="price-result__title">Precio encontrado</h2>
      </div>
      <div className="price-result__body">
        <dl className="price-result__grid">
          <div className="price-result__item">
            <dt className="price-result__label">ID de Producto</dt>
            <dd className="price-result__value">{props.productId}</dd>
          </div>
          <div className="price-result__item">
            <dt className="price-result__label">ID de Marca</dt>
            <dd className="price-result__value">{props.brandId}</dd>
          </div>
          <div className="price-result__item">
            <dt className="price-result__label">Tarifa (Price List)</dt>
            <dd className="price-result__value">{props.priceList}</dd>
          </div>
          <div className="price-result__item">
            <dt className="price-result__label">Precio final</dt>
            <dd className="price-result__value price-result__value--highlight">
              {formatPrice(props.price, props.currency)}
            </dd>
          </div>
          <div className="price-result__item">
            <dt className="price-result__label">Fecha de inicio</dt>
            <dd className="price-result__value">{formatDateTime(props.startDate)}</dd>
          </div>
          <div className="price-result__item">
            <dt className="price-result__label">Fecha de fin</dt>
            <dd className="price-result__value">{formatDateTime(props.endDate)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
