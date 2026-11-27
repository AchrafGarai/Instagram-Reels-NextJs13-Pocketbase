import Image from 'next/image'
import type { Profile } from '@/lib/pocketbase/types'

export function Avatar({
  user,
  size = 40,
}: {
  user: Pick<Profile, 'name' | 'avatarUrl'>
  size?: number
}) {
  if (user.avatarUrl) {
    return (
      <Image
        src={user.avatarUrl}
        alt=""
        width={size}
        height={size}
        // PocketBase already serves a resized thumbnail.
        unoptimized
        className="shrink-0 rounded-full bg-zinc-100 object-cover"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 to-accent font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {user.name.charAt(0).toUpperCase()}
    </span>
  )
}
