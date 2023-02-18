import React from 'react'
import { Comment } from 'types'
import CommentCard from './CommentCard'

function InfiniteCommentsPage({
  data,
  onMutate,
}: {
  data: Comment[]
  onMutate: any
}) {
  const handleDelete = async () => {
    await onMutate()
  }

  return (
    <div>
      {data.map((comment: Comment) => {
        return (
          <CommentCard
            data={comment}
            key={comment.id}
            onDelete={handleDelete}
          />
        )
      })}
    </div>
  )
}

export default InfiniteCommentsPage
