import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'

interface UseGsapAnimationOptions {
  /** Si se debe respetar prefers-reduced-motion */
  respectReducedMotion?: boolean
}

/**
 * Crea un contexto GSAP vinculado a un ref de contenedor.
 * Limpia automáticamente todas las animaciones al desmontar.
 *
 * Cada componente define sus propias animaciones accediendo a contextRef.current
 * dentro de su propio useLayoutEffect, lo que ofrece máxima flexibilidad.
 *
 * @param options - Opciones de configuración
 * @returns { containerRef, contextRef } - Refs para el contenedor DOM y el contexto GSAP
 */
export function useGsapAnimation(options?: UseGsapAnimationOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contextRef = useRef<gsap.Context | null>(null)

  useLayoutEffect(() => {
    if (options?.respectReducedMotion) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (mediaQuery.matches) return
    }

    if (containerRef.current) {
      contextRef.current = gsap.context(() => {}, containerRef.current)
    }

    return () => {
      contextRef.current?.revert()
    }
  }, [options?.respectReducedMotion])

  return { containerRef, contextRef }
}
