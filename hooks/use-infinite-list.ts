'use client'

import { useCallback, useRef, useState, useTransition } from 'react'
import type { Page } from '@/lib/pocketbase/types'

/**
 * Appends pages fetched by a Server Action to a server-rendered first page.
 *
 * Items are de-duplicated by id, so a record that shifts between pages (when
 * something new is posted while scrolling) is never rendered twice.
 */
export function useInfiniteList<T extends { id: string }>(
  initial: Page<T>,
  loadPage: (page: number) => Promise<Page<T>>,
) {
  const [items, setItems] = useState(initial.items)
  const [page, setPage] = useState(initial.page)
  const [hasMore, setHasMore] = useState(initial.hasMore)
  const [error, setError] = useState(false)
  const [isPending, startTransition] = useTransition()
  const inFlight = useRef(false)

  const loadMore = useCallback(() => {
    if (inFlight.current || !hasMore) return
    inFlight.current = true
    setError(false)

    startTransition(async () => {
      try {
        const next = await loadPage(page + 1)
        setItems((current) => {
          const seen = new Set(current.map((item) => item.id))
          return [...current, ...next.items.filter((item) => !seen.has(item.id))]
        })
        setPage(next.page)
        setHasMore(next.hasMore)
      } catch {
        setError(true)
      } finally {
        inFlight.current = false
      }
    })
  }, [hasMore, loadPage, page])

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  return { items, hasMore, isPending, error, loadMore, remove }
}
