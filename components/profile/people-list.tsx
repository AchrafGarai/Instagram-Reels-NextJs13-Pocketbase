'use client'

import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadMore } from '@/components/ui/load-more'
import { RelativeTime } from '@/components/ui/relative-time'
import { useInfiniteList } from '@/hooks/use-infinite-list'
import type { Page, Profile } from '@/lib/pocketbase/types'

type Row = { id: string; created: string; author: Profile; postId?: string }

/** A paginated list of people: who liked a post, or who liked your posts. */
export function PeopleList<T extends Row>({
  initial,
  loadPage,
  emptyTitle,
  describe,
}: {
  initial: Page<T>
  loadPage: (page: number) => Promise<Page<T>>
  emptyTitle: string
  describe?: (row: T) => React.ReactNode
}) {
  const { items, hasMore, isPending, error, loadMore } = useInfiniteList(initial, loadPage)

  if (items.length === 0) return <EmptyState title={emptyTitle} />

  return (
    <ul className="flex flex-col gap-4">
      {items.map((row) => (
        <li key={row.id} className="flex items-center gap-3">
          <Link href={`/profile/${row.author.username}`}>
            <Avatar user={row.author} size={44} />
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/profile/${row.author.username}`} className="block truncate text-sm font-semibold">
              {row.author.name}
            </Link>
            <p className="truncate text-sm text-zinc-500">
              {describe ? describe(row) : `@${row.author.username}`}
            </p>
          </div>
          <RelativeTime date={row.created} />
        </li>
      ))}
      {hasMore && <LoadMore onLoadMore={loadMore} isPending={isPending} error={error} />}
    </ul>
  )
}
