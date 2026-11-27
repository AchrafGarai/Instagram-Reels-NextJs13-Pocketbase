'use client'

import { useCallback, useTransition } from 'react'
import Link from 'next/link'
import { TrashIcon } from '@radix-ui/react-icons'
import { Avatar } from '@/components/ui/avatar'
import { LoadMore } from '@/components/ui/load-more'
import { RelativeTime } from '@/components/ui/relative-time'
import { useInfiniteList } from '@/hooks/use-infinite-list'
import { deleteComment, loadComments } from '@/lib/actions/social'
import type { CommentItem, Page } from '@/lib/pocketbase/types'

export function CommentList({
  postId,
  initial,
  viewerId,
}: {
  postId: string
  initial: Page<CommentItem>
  viewerId: string | null
}) {
  const loadPage = useCallback((page: number) => loadComments(postId, page), [postId])
  const { items, hasMore, isPending, error, loadMore, remove } = useInfiniteList(initial, loadPage)

  if (items.length === 0) {
    return <p className="py-6 text-sm text-zinc-500">No comments yet. Start the conversation.</p>
  }

  return (
    <ul className="flex flex-col gap-5">
      {items.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          canDelete={comment.author.id === viewerId}
          onDelete={async () => {
            remove(comment.id)
            await deleteComment(comment.id, postId)
          }}
        />
      ))}
      {hasMore && <LoadMore onLoadMore={loadMore} isPending={isPending} error={error} />}
    </ul>
  )
}

function Comment({
  comment,
  canDelete,
  onDelete,
}: {
  comment: CommentItem
  canDelete: boolean
  onDelete: () => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <li className="flex items-start gap-3" aria-busy={isPending}>
      <Link href={`/profile/${comment.author.username}`}>
        <Avatar user={comment.author} size={36} />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <Link href={`/profile/${comment.author.username}`} className="mr-2 font-semibold">
            {comment.author.username}
          </Link>
          <span className="break-words">{comment.content}</span>
        </p>
        <RelativeTime date={comment.created} />
      </div>
      {canDelete && (
        <button
          type="button"
          onClick={() => startTransition(onDelete)}
          disabled={isPending}
          className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-600"
          aria-label="Delete comment"
        >
          <TrashIcon />
        </button>
      )}
    </li>
  )
}
