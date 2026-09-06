'use client'

import { useEffect, useRef } from 'react'
import type { ElementType, ReactNode } from 'react'

type RevealProps = {
  as?: ElementType
  children: ReactNode
  className?: string
  delay?: number
}

/**
 * Odsłania dziecko przy wejściu w viewport (IntersectionObserver + CSS
 * transition z `[data-reveal]` w styles.css). Celowo bez biblioteki
 * animacyjnej — tania kosztem CPU/bundla, tania też w utrzymaniu.
 */
export const Reveal = ({ as: Tag = 'div', children, className, delay = 0 }: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
