import React from 'react'
import CreatePost from 'components/post/create/CreatePost'
import { useUserProtected } from 'utils/useUser'

function page() {
  useUserProtected()
  return (
    <div className="border border-gray-200 rounded-3xl overflow-hidden">
      <CreatePost />
    </div>
  )
}

export default page
