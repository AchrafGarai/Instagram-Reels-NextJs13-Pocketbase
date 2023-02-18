import React from 'react'
import { Notification } from 'types'
import { Avatar, ButtonLink } from 'components/UI'
import { Date } from 'components/UI'
function NotificationCard({ notification }: { notification: Notification }) {
  return (
    <div className="flex p-1 text-sm w-full items-center gap-4 sm:p-4 sm:text-base">
      <Avatar user={notification.expand.profile} />
      <div className="flex-grow">
        <div>{notification.expand.profile.name} has liked your post</div>
        <Date date={notification.created} />
      </div>

      <ButtonLink href={`/posts/${notification.expand.post.id}`}>
        View Post
      </ButtonLink>
    </div>
  )
}

export default NotificationCard
