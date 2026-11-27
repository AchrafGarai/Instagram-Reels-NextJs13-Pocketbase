import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Feed } from '@/components/feed/feed'
import { ProfileHeader } from '@/components/profile/profile-header'
import { Spinner } from '@/components/ui/spinner'
import { getFeedPage, getProfile } from '@/lib/data'
import { getCurrentUser } from '@/lib/pocketbase/server'

export async function generateMetadata({
  params,
}: PageProps<'/profile/[username]'>): Promise<Metadata> {
  const { username } = await params
  const result = await getProfile(username)
  return { title: result ? `${result.profile.name} (@${username})` : 'Profile not found' }
}

export default function ProfilePage({ params }: PageProps<'/profile/[username]'>) {
  return (
    <Suspense fallback={<div className="flex justify-center pt-32"><Spinner /></div>}>
      <ProfileContent params={params} />
    </Suspense>
  )
}

async function ProfileContent({ params }: Pick<PageProps<'/profile/[username]'>, 'params'>) {
  const { username } = await params
  const [result, viewer] = await Promise.all([getProfile(username), getCurrentUser()])
  if (!result) notFound()

  const scope = { kind: 'author', authorId: result.profile.id } as const
  const initial = await getFeedPage(scope)

  return (
    <div className="flex flex-col gap-8 pt-20 sm:pt-8">
      <ProfileHeader
        profile={result.profile}
        postCount={result.postCount}
        isOwner={viewer?.id === result.profile.id}
      />
      <Feed
        key={`${result.profile.id}:${initial.items[0]?.id ?? 'empty'}`}
        initial={initial}
        scope={scope}
        emptyTitle={`@${username} hasn’t posted yet`}
      />
    </div>
  )
}
