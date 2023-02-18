import React from 'react'
import { Like } from 'types'
import LikeCard from './LikeCard'

function InfiniteLikesPage({ data }: { data: Like[] }) {
  return (
    <div>
      {data.map((like: Like) => {
        return <LikeCard data={like} key={like.id} />
      })}
    </div>
  )
}

export default InfiniteLikesPage
