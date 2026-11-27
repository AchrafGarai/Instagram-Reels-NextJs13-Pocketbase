import { Avatar } from '@/components/ui/avatar'
import { ButtonLink } from '@/components/ui/button'
import type { Profile } from '@/lib/pocketbase/types'

export function ProfileHeader({
  profile,
  postCount,
  isOwner,
}: {
  profile: Profile
  postCount: number
  isOwner: boolean
}) {
  return (
    <section className="mx-auto flex max-w-md snap-start flex-col items-center gap-4 rounded-3xl border border-zinc-200 px-6 py-10 text-center">
      <Avatar user={profile} size={96} />
      <div>
        <h1 className="text-xl font-semibold">{profile.name}</h1>
        <p className="text-sm text-zinc-500">@{profile.username}</p>
      </div>
      {profile.bio && <p className="max-w-xs text-sm text-zinc-700">{profile.bio}</p>}
      <p className="text-sm">
        <span className="font-semibold tabular-nums">{postCount}</span>{' '}
        <span className="text-zinc-500">{postCount === 1 ? 'reel' : 'reels'}</span>
      </p>
      {isOwner && (
        <ButtonLink href="/settings/profile" variant="secondary">
          Edit profile
        </ButtonLink>
      )}
    </section>
  )
}
