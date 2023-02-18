import React from 'react'
import ProfileHeader from '../ProfileHeader'
import InfinitePosts from 'components/post/InfinitePosts'
import Error from 'components/UI/Error'
import { api_Url } from 'utils/consts'
import { UserList } from 'types'
import { useUser } from 'utils/useUser'
type PageProps = {
  params: {
    userName: string
  }
  children?: React.ReactNode
}

async function page({ params }: PageProps) {
  const { userName } = params
  const profile = (await fetch(
    `${api_Url}collections/users/records?filter=(username='${userName}')`,
  ).then((res) => res.json())) as UserList

  const user = profile.items[0] || null

  if (!user) {
    return <Error message="User is not found" />
  }

  const posts = await fetch(
    `${api_Url}collections/posts/records?page=1&perPage=1&filter=(profile='${user.id}')`,
  ).then((res) => res.json())

  const currentUser = useUser()

  return (
    <div className="container">
      <ProfileHeader id={user.id} user={user} totalPosts={posts.totalItems} />
      <InfinitePosts userId={user.id} />
    </div>
  )
}

export default page
