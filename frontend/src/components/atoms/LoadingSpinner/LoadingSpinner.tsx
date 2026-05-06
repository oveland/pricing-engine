import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { useGsapAnimation } from '../../../hooks/useGsapAnimation'
import './LoadingSpinner.scss'

export interface LoadingSpinnerProps {
  /** Texto accesible para lectores de pantalla (default: "Cargando") */
  label?: string
}

export function LoadingSpinner({ label = 'Cargando' }: LoadingSpinnerProps) {
  const { containerRef, contextRef } = useGsapAnimation({ respectReducedMotion: true })

  useLayoutEffect(() => {
    if (!contextRef.current || !containerRef.current) return

    const spinner = containerRef.current.querySelector('.loading-spinner__circle')
    if (spinner) {
      contextRef.current.add(() => {
        gsap.to(spinner, {
          rotation: 360,
          duration: 1,
          repeat: -1,
          ease: 'linear',
        })
      })
    }
  }, [contextRef, containerRef])

  return (
    <output
      ref={containerRef as React.RefObject<HTMLOutputElement>}
      className="loading-spinner"
      role="status"
    >
      <div className="loading-spinner__circle" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </output>
  )
}
