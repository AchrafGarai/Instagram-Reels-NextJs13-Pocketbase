import Link from 'next/link'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { Avatar } from '@/components/ui/avatar'
import type { FeedPost } from '@/lib/pocketbase/types'
import { LikeButton } from './like-button'
import { VideoPlayer } from './video-player'

export function PostCard({ post }: { post: FeedPost }) {
  return (
    <article className="relative h-full overflow-hidden bg-black text-white shadow-2xl sm:rounded-3xl">
      <VideoPlayer src={post.videoUrl} label={post.caption || `Reel by ${post.author.name}`} />

      <header className="absolute inset-x-0 top-0 z-10 flex items-center gap-3 bg-gradient-to-b from-black/50 to-transparent p-5">
        <Link
          href={`/profile/${post.author.username}`}
          className="flex items-center gap-2.5 font-medium drop-shadow"
        >
          <Avatar user={post.author} size={36} />
          {post.author.name}
        </Link>
      </header>

      <footer className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 bg-gradient-to-t from-black/60 to-transparent p-5 pr-20 pb-20 sm:pb-5">
        {post.caption && (
          <Link href={`/posts/${post.id}`} className="line-clamp-3 text-sm drop-shadow">
            {post.caption}
          </Link>
        )}
        <div className="flex items-center gap-3">
          <LikeButton postId={post.id} initial={{ liked: post.likedByMe, likes: post.likes }} />
          <Link
            href={`/posts/${post.id}`}
            className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm"
            aria-label={`${post.comments} comments`}
          >
            <ChatBubbleIcon width={18} height={18} />
            <span className="tabular-nums">{post.comments}</span>
          </Link>
        </div>
      </footer>
    </article>
  )
}
