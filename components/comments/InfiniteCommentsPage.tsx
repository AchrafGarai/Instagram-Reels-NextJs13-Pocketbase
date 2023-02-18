import React from 'react'
import CommentCard from './CommentCard'

function InfiniteCommentsPage({ data, onMutate }: any) {
  const handleDelete = async () => {
    await onMutate()
  }

  return (
    <div>
      {data.map((comment: any) => {
        return <CommentCard data={comment} onDelete={handleDelete} />
      })}
    </div>
  )
}

export default InfiniteCommentsPage
