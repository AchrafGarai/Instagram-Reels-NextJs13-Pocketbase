import React from 'react'
import { User } from 'types'
import { Avatar } from 'components/UI'

function PostHeader({ user }: { user: User }) {
  return (
    <div className=" z-10 drop-shadow-sm absolute top-0 text-white p-6 flex gap-2 items-center w-full bg-gradient-to-b from-custom-shadow">
      <div className="flex gap-2 items-center flex-grow">
        <Avatar user={user} size={40} />
        {user.name}
      </div>
    </div>
  )
}

export default PostHeader
