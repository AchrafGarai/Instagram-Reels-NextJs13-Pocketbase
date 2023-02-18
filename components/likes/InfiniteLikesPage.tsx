import React from 'react'
import LikeCard from './LikeCard'

function InfiniteLikesPage({ data }: any) {
  return (
    <div>
      {data.map((like: any) => {
        return <LikeCard data={like} />
      })}
    </div>
  )
}

export default InfiniteLikesPage
