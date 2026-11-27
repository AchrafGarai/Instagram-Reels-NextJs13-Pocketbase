'use client'

import { useEffect } from 'react'
import { useInView } from '@/hooks/use-in-view'
import { Button } from './button'
import { Spinner } from './spinner'

/** Sentinel that loads the next page when scrolled into view. */
export function LoadMore({
  onLoadMore,
  isPending,
  error,
}: {
  onLoadMore: () => void
  isPending: boolean
  error: boolean
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '400px' })

  useEffect(() => {
    if (inView && !error) onLoadMore()
  }, [inView, error, onLoadMore])

  return (
    <div ref={ref} className="flex justify-center py-6">
      {error ? (
        <Button variant="secondary" onClick={onLoadMore}>
          Couldn’t load more. Retry
        </Button>
      ) : (
        isPending && <Spinner />
      )}
    </div>
  )
}
