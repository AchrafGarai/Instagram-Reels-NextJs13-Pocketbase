import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PostCard } from '@/components/feed/post-card'
import { getPost } from '@/lib/data'

export default function PostLayout({ params, children }: LayoutProps<'/posts/[id]'>) {
  return (
    <div className="grid gap-6 pt-20 sm:grid-cols-2 sm:pt-8">
      <div className="-mx-4 h-[80svh] sm:mx-0 sm:h-[760px] sm:max-h-[calc(100svh-6rem)]">
        <Suspense fallback={<div className="h-full animate-pulse bg-zinc-200 sm:rounded-3xl" />}>
          <PostVideo params={params} />
        </Suspense>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

async function PostVideo({ params }: Pick<LayoutProps<'/posts/[id]'>, 'params'>) {
  const { id } = await params
  const post = await getPost(id)
  if (!post) notFound()
  return <PostCard post={post} />
}
