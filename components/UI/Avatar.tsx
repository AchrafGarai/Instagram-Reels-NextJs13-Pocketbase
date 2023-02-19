import { User } from 'types'
import Image from 'next/image'
import Link from 'next/link'
import { api_Url } from 'utils/consts'

type Props = {
  user: User
  size?: number
}
function Avatar({ user, size }: Props) {
  const avatarImage = `${api_Url}files/_pb_users_auth_/${user.id}/${user.avatar}`

  const s = size || 48

  return (
    <>
      {user.avatar ? (
        <Link href={`profile/${user?.username}`}>
          <div
            className="relative"
            style={{ width: `${s}px`, height: `${s}px` }}
          >
            <Image
              className="rounded-full object-cover"
              src={avatarImage}
              fill
              alt={'logo'}
            />
          </div>
        </Link>
      ) : (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-200 text-lg font-semibold">
          <p>{user?.name?.toUpperCase().charAt(0)}</p>
        </div>
      )}
    </>
  )
}

export default Avatar
