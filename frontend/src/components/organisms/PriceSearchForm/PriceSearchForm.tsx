import type { FormEvent } from 'react'
import { Input } from '../../atoms/Input/Input'
import { Button } from '../../atoms/Button/Button'
import './PriceSearchForm.scss'

interface PriceSearchFormProps {
  date: string
  productId: string
  brandId: string
  loading: boolean
  onDateChange: (value: string) => void
  onProductIdChange: (value: string) => void
  onBrandIdChange: (value: string) => void
  onSubmit: () => void
}

export function PriceSearchForm({
  date,
  productId,
  brandId,
  loading,
  onDateChange,
  onProductIdChange,
  onBrandIdChange,
  onSubmit,
}: PriceSearchFormProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="price-search-form"
      aria-label="Formulario de consulta de precios"
    >
      <h2 className="price-search-form__title">Parámetros de consulta</h2>
      <div className="price-search-form__fields">
        <Input
          id="date"
          label="Fecha de aplicación"
          type="datetime-local"
          value={date}
          onChange={onDateChange}
          required
        />
        <Input
          id="productId"
          label="ID de Producto"
          type="number"
          value={productId}
          onChange={onProductIdChange}
          required
          min="1"
        />
        <Input
          id="brandId"
          label="ID de Marca"
          type="number"
          value={brandId}
          onChange={onBrandIdChange}
          required
          min="1"
        />
      </div>
      <div className="price-search-form__actions">
        <Button type="submit" disabled={loading}>
          {loading ? 'Consultando…' : 'Consultar precio'}
        </Button>
      </div>
    </form>
  )
}
