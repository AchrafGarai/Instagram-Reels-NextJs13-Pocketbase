'use client'

import { useCallback } from 'react'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadMore } from '@/components/ui/load-more'
import { useInfiniteList } from '@/hooks/use-infinite-list'
import { loadFeedPage } from '@/lib/actions/posts'
import type { FeedPost, Page } from '@/lib/pocketbase/types'
import type { FeedScope } from '@/lib/validation'
import { PostCard } from './post-card'

export function Feed({
  initial,
  scope,
  emptyTitle = 'No reels yet',
  emptyMessage,
}: {
  initial: Page<FeedPost>
  scope: FeedScope
  emptyTitle?: string
  emptyMessage?: React.ReactNode
}) {
  const loadPage = useCallback((page: number) => loadFeedPage(scope, page), [scope])
  const { items, hasMore, isPending, error, loadMore } = useInfiniteList(initial, loadPage)

  if (items.length === 0) {
    return <EmptyState title={emptyTitle}>{emptyMessage}</EmptyState>
  }

  return (
    <div className="flex flex-col">
      {items.map((post) => (
        <section
          key={post.id}
          className="-mx-4 flex h-svh snap-start items-center justify-center sm:mx-auto sm:h-[calc(100svh-4rem)] sm:w-[min(420px,100%)] sm:py-6"
        >
          <div className="h-full w-full sm:max-h-[760px]">
            <PostCard post={post} />
          </div>
        </section>
      ))}
      {hasMore ? (
        <LoadMore onLoadMore={loadMore} isPending={isPending} error={error} />
      ) : (
        <p className="snap-end py-10 text-center text-sm text-zinc-500">You’re all caught up.</p>
      )}
    </div>
  )
}

export function FeedSkeleton() {
  return (
    <div className="-mx-4 flex h-svh items-center justify-center sm:mx-auto sm:h-[calc(100svh-4rem)] sm:w-[min(420px,100%)] sm:py-6">
      <div className="h-full w-full animate-pulse bg-zinc-200 sm:max-h-[760px] sm:rounded-3xl" />
    </div>
  )
}
