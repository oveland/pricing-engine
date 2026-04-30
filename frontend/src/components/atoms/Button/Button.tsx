import './Button.scss'

interface ButtonProps {
  children: React.ReactNode
  type?: 'submit' | 'button'
  disabled?: boolean
}

export function Button({ children, type = 'button', disabled }: ButtonProps) {
  return (
    <button type={type} disabled={disabled} className="button">
      {children}
    </button>
  )
}
