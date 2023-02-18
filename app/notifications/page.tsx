import React from 'react'
import NotificationList from 'components/notifications/NotificationList'
import { useUserProtected } from 'utils/useUser'
function page() {
  useUserProtected()
  return (
    <div className="p-4 border border-zinc-200 rounded-3xl">
      <div className="p-4 border-b border-zinc-200 mb-4">
        <h1 className=" text-xl font-semibold">Notifications</h1>
      </div>
      <NotificationList />
    </div>
  )
}

export default page
