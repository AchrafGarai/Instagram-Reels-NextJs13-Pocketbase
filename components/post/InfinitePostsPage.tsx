import React from 'react'
import PostCard from './PostCard'

function InfinitePostsPage({ data, onMutate }: any) {
  const handleDelete = async () => {
    await onMutate()
  }

  return (
    <>
      {data.map((post: any) => {
        return (
          <div className="max-w-[375px] mx-auto w-full h-screen flex flex-col justify-center snap-start sm:pt-20">
            <PostCard post={post} />
          </div>
        )
      })}
    </>
  )
}

export default InfinitePostsPage
