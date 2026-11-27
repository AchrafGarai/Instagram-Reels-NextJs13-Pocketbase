import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { LikesList } from '@/components/profile/likes-list'
import { Spinner } from '@/components/ui/spinner'
import { getLikesPage } from '@/lib/data'
import { recordId } from '@/lib/validation'
import { notFound } from 'next/navigation'

export const metadata: Metadata = { title: 'Likes' }

export default function LikesPage({ params }: PageProps<'/posts/[id]/likes'>) {
  return (
    <Suspense fallback={<Spinner />}>
      <Likes params={params} />
    </Suspense>
  )
}

async function Likes({ params }: Pick<PageProps<'/posts/[id]/likes'>, 'params'>) {
  const { id } = await params
  if (!recordId.safeParse(id).success) notFound()
  const likes = await getLikesPage(id)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3 border-b border-zinc-200 pb-4">
        <Link
          href={`/posts/${id}`}
          className="rounded-full p-2 hover:bg-zinc-100"
          aria-label="Back to the reel"
        >
          <ArrowLeftIcon width={20} height={20} />
        </Link>
        <h1 className="flex-1 text-lg font-semibold">Likes</h1>
        <span className="font-semibold tabular-nums">{likes.totalItems}</span>
      </header>
      <LikesList key={likes.totalItems} postId={id} initial={likes} />
    </div>
  )
}
