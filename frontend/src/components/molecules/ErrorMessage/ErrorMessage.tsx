import './ErrorMessage.scss'

interface ErrorMessageProps {
  title: string
  message: string
}

export function ErrorMessage({ title, message }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <div className="error-message__header">
        <h2 className="error-message__title">{title}</h2>
      </div>
      <div className="error-message__body">
        <p className="error-message__text">{message}</p>
      </div>
    </div>
  )
}
