import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Feed, FeedSkeleton } from '@/components/feed/feed'
import { SearchForm } from '@/components/layout/search-form'
import { EmptyState } from '@/components/ui/empty-state'
import { getFeedPage } from '@/lib/data'
import { searchScope } from '@/lib/validation'

export const metadata: Metadata = { title: 'Search' }

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <div className="pt-20 sm:pt-8">
      <div className="mb-6 flex justify-center sm:hidden">
        <Suspense>
          <SearchForm />
        </Suspense>
      </div>
      <Suspense fallback={<FeedSkeleton />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function SearchResults({ searchParams }: Pick<PageProps<'/search'>, 'searchParams'>) {
  const { q } = await searchParams
  const scope = searchScope.safeParse({ kind: 'search', query: typeof q === 'string' ? q : '' })

  if (!scope.success) {
    return <EmptyState title="Search reels and people">Try a caption, name or username.</EmptyState>
  }

  const initial = await getFeedPage(scope.data)
  return (
    <>
      <p className="mb-2 text-center text-sm text-zinc-500">
        {initial.totalItems} {initial.totalItems === 1 ? 'result' : 'results'} for “{scope.data.query}”
      </p>
      <Feed
        key={scope.data.query}
        initial={initial}
        scope={scope.data}
        emptyTitle="Nothing matches that search"
      />
    </>
  )
}
