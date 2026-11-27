import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { CommentForm } from '@/components/comments/comment-form'
import { CommentList } from '@/components/comments/comment-list'
import { PostMenu } from '@/components/posts/post-menu'
import { Avatar } from '@/components/ui/avatar'
import { ButtonLink } from '@/components/ui/button'
import { RelativeTime } from '@/components/ui/relative-time'
import { Spinner } from '@/components/ui/spinner'
import { getCommentsPage, getPost } from '@/lib/data'
import { getCurrentUser } from '@/lib/pocketbase/server'

export async function generateMetadata({ params }: PageProps<'/posts/[id]'>): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)
  if (!post) return { title: 'Reel not found' }
  return {
    title: `Reel by ${post.author.name}`,
    description: post.caption || undefined,
  }
}

export default function PostPage({ params }: PageProps<'/posts/[id]'>) {
  return (
    <Suspense fallback={<Spinner />}>
      <PostDetails params={params} />
    </Suspense>
  )
}

async function PostDetails({ params }: Pick<PageProps<'/posts/[id]'>, 'params'>) {
  const { id } = await params
  const [post, viewer, comments] = await Promise.all([
    getPost(id),
    getCurrentUser(),
    getCommentsPage(id),
  ])
  if (!post) notFound()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <Link href={`/profile/${post.author.username}`}>
          <Avatar user={post.author} size={48} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/profile/${post.author.username}`} className="block font-semibold">
            {post.author.name}
          </Link>
          <RelativeTime date={post.created} />
        </div>
        {viewer?.id === post.author.id && <PostMenu postId={post.id} />}
      </header>

      {post.caption && <p className="whitespace-pre-line">{post.caption}</p>}

      <Link href={`/posts/${post.id}/likes`} className="text-sm font-medium hover:underline">
        {post.likes} {post.likes === 1 ? 'like' : 'likes'}
      </Link>

      <section aria-labelledby="comments-heading" className="flex flex-col gap-4 border-t border-zinc-200 pt-6">
        <h2 id="comments-heading" className="font-semibold">
          Comments <span className="text-zinc-500 tabular-nums">{comments.totalItems}</span>
        </h2>
        <CommentList
          key={`${comments.totalItems}:${comments.items[0]?.id ?? ''}`}
          postId={post.id}
          initial={comments}
          viewerId={viewer?.id ?? null}
        />
        {viewer ? (
          <CommentForm postId={post.id} />
        ) : (
          <ButtonLink href={`/login?next=/posts/${post.id}`} variant="secondary">
            Log in to comment
          </ButtonLink>
        )}
      </section>
    </div>
  )
}
