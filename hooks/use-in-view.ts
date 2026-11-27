'use client'

import { useEffect, useRef, useState } from 'react'

/** Tracks whether an element is visible, using a single IntersectionObserver. */
export function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const { root, rootMargin, threshold } = options ?? {}

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      root,
      rootMargin,
      threshold,
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [root, rootMargin, threshold])

  return { ref, inView }
}
