import { useUser } from 'utils/useUser'
import { User } from 'types'
import { Avatar, ButtonLink } from 'components/UI'

type Props = {
  id: string
  user: User
  totalPosts: number
}

function ProfileHeader({ user, totalPosts, id }: Props) {
  const profile = useUser()
  const currentUserId = profile?.model?.id || ''

  return (
    <div className="snap-start pt-24">
      <div className="mx-auto max-w-[420px] p-6 py-12 border border-slate-200 rounded-3xl flex flex-col gap-6 mb-8 sm:mb-0 ">
        <div className="flex flex-col gap-2 items-center">
          <Avatar size={96} user={user} />
          <h1 className=" text-xl font-semibold text-center">{user.name}</h1>
          <p className=" text-sm text-zinc-500 ">@{user.username}</p>
          {user && currentUserId == id && (
            <ButtonLink href={`/settings/edit`}>Edit Profile</ButtonLink>
          )}
        </div>
        <div>
          <h2 className="font-semibold">Bio</h2>
          <p>{user.bio}</p>
        </div>
        <div>
          <h2 className="font-semibold">Reels</h2>
          <p className=" text-sm text-zinc-500 ">{totalPosts}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
