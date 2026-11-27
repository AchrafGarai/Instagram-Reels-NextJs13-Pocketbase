'use client'

import Link from 'next/link'
import { PeopleList } from '@/components/profile/people-list'
import { loadActivity } from '@/lib/actions/social'
import type { ActivityItem, Page } from '@/lib/pocketbase/types'

export function ActivityList({ initial }: { initial: Page<ActivityItem> }) {
  return (
    <PeopleList
      initial={initial}
      loadPage={loadActivity}
      emptyTitle="No activity yet"
      describe={(item) => (
        <>
          liked{' '}
          <Link href={`/posts/${item.postId}`} className="font-medium text-accent hover:underline">
            your reel
          </Link>
        </>
      )}
    />
  )
}
