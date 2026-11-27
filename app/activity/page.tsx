import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ActivityList } from '@/components/activity/activity-list'
import { PageHeader } from '@/components/ui/page-header'
import { Spinner } from '@/components/ui/spinner'
import { getActivityPage } from '@/lib/data'
import { requireUser } from '@/lib/pocketbase/server'

export const metadata: Metadata = { title: 'Activity' }

export default function ActivityPage() {
  return (
    <div className="mx-auto max-w-xl pt-20 sm:pt-8">
      <PageHeader title="Activity" />
      <Suspense fallback={<Spinner />}>
        <Activity />
      </Suspense>
    </div>
  )
}

async function Activity() {
  const user = await requireUser()
  const initial = await getActivityPage(user.id)
  return <ActivityList initial={initial} />
}
