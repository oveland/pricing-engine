import './Input.scss'

interface InputProps {
  id: string
  label: string
  type: 'text' | 'number' | 'datetime-local'
  value: string
  onChange: (value: string) => void
  required?: boolean
  min?: string
}

export function Input({ id, label, type, value, onChange, required, min }: InputProps) {
  return (
    <div className="input">
      <label htmlFor={id} className="input__label">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        min={min}
        className="input__field"
      />
    </div>
  )
}
