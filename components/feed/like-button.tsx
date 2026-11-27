'use client'

import { useOptimistic, useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import { toggleLike } from '@/lib/actions/social'

type LikeState = { liked: boolean; likes: number }

export function LikeButton({ postId, initial }: { postId: string; initial: LikeState }) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState(initial)
  const [optimistic, setOptimistic] = useOptimistic(state)
  const [, startTransition] = useTransition()

  const onClick = () => {
    startTransition(async () => {
      setOptimistic({
        liked: !optimistic.liked,
        likes: optimistic.likes + (optimistic.liked ? -1 : 1),
      })
      const result = await toggleLike(postId)
      if (result.ok) {
        setState({ liked: result.liked, likes: result.likes })
      } else {
        router.push(`/login?next=${encodeURIComponent(pathname)}`)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={optimistic.liked}
      aria-label={optimistic.liked ? 'Unlike' : 'Like'}
      className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm transition-transform active:scale-95"
    >
      {optimistic.liked ? (
        <HeartFilledIcon className="text-red-500" width={20} height={20} />
      ) : (
        <HeartIcon width={20} height={20} />
      )}
      <span className="text-sm font-medium tabular-nums">{optimistic.likes}</span>
    </button>
  )
}
