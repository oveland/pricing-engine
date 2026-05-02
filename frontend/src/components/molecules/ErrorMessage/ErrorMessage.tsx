import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { useGsapAnimation } from '../../../hooks/useGsapAnimation'
import './ErrorMessage.scss'

interface ErrorMessageProps {
  title: string
  message: string
}

export function ErrorMessage({ title, message }: ErrorMessageProps) {
  const { containerRef, contextRef } = useGsapAnimation({ respectReducedMotion: true })

  useLayoutEffect(() => {
    if (!contextRef.current || !containerRef.current) return
    contextRef.current.add(() => {
      gsap.fromTo(
        containerRef.current,
        { x: 0 },
        {
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
          keyframes: [
            { x: -10, duration: 0.07 },
            { x: 10, duration: 0.07 },
            { x: -8, duration: 0.07 },
            { x: 8, duration: 0.07 },
            { x: -4, duration: 0.07 },
            { x: 4, duration: 0.07 },
            { x: 0, duration: 0.07 },
          ],
        }
      )
    })
  }, [contextRef, containerRef])

  return (
    <div ref={containerRef} className="error-message glassmorphism" role="alert">
      <div className="error-message__header">
        <h2 className="error-message__title">{title}</h2>
      </div>
      <div className="error-message__body">
        <p className="error-message__text">{message}</p>
      </div>
    </div>
  )
}
