import React from 'react'
import { Post } from 'types'
import PostCard from './PostCard'

function InfinitePostsPage({
  data,
  onMutate,
}: {
  data: Post[]
  onMutate: any
}) {
  const handleDelete = async () => {
    await onMutate()
  }

  return (
    <>
      {data.map((post: Post) => {
        return (
          <div
            key={post.id}
            className="max-w-[375px] mx-auto w-full h-screen flex flex-col justify-center snap-start sm:pt-20"
          >
            <PostCard post={post} />
          </div>
        )
      })}
    </>
  )
}

export default InfinitePostsPage
