import './ProductImagePlaceholder.scss'

export interface ProductImagePlaceholderProps {
  /** Clase CSS adicional para personalización (opcional) */
  className?: string
}

export function ProductImagePlaceholder({ className }: ProductImagePlaceholderProps) {
  return (
    <div
      className={`product-image-placeholder max-w-sm mx-auto bg-white/[0.03] border border-white/[0.06] rounded-xl${className ? ` ${className}` : ''}`}
      style={{ aspectRatio: '3 / 4' }}
    >
      <div className="product-image-placeholder__icon-wrapper">
        <svg
          className="product-image-placeholder__icon text-white/20"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Minimalist hanger silhouette */}
          <path
            d="M24 8C24 6.343 25.343 5 27 5C28.657 5 30 6.343 30 8C30 9.306 29.164 10.417 28 10.829V14L38 24V28H10V24L20 14V10.829C18.836 10.417 18 9.306 18 8C18 6.343 19.343 5 21 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 28L10 32H38V28"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
