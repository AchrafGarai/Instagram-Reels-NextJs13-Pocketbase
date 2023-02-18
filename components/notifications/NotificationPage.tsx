'use client'
import React from 'react'
import { Notification } from 'types'
import NotificationCard from './NotificationCard'
function NotificationPage({
  notifications,
}: {
  notifications: Notification[]
}) {
  console.log(notifications)
  return (
    notifications && (
      <div>
        {notifications.map((notification: Notification) => (
          <>
            <NotificationCard notification={notification} />
          </>
        ))}
        <br />
      </div>
    )
  )
}

export default NotificationPage
