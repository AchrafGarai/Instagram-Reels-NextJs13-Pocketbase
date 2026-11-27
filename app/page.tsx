import { Suspense } from 'react'
import { Feed, FeedSkeleton } from '@/components/feed/feed'
import { ButtonLink } from '@/components/ui/button'
import { getFeedPage } from '@/lib/data'

export default function HomePage() {
  return (
    <Suspense fallback={<FeedSkeleton />}>
      <HomeFeed />
    </Suspense>
  )
}

async function HomeFeed() {
  const initial = await getFeedPage({ kind: 'all' })
  return (
    <Feed
      key={initial.items[0]?.id ?? 'empty'}
      initial={initial}
      scope={{ kind: 'all' }}
      emptyMessage={
        <ButtonLink href="/create" className="mt-4">
          Post the first reel
        </ButtonLink>
      }
    />
  )
}
