'use client'

import React from 'react'
import { pb } from '../../utils/pocketbase'
import { useState } from 'react'
import LikeButton from './LikeButton'
import { api_Url } from 'utils/consts'
import useSWR from 'swr'
import Loading from 'components/UI/Loading'
import { PostFooterSkeleton } from 'components/UI'
import { CommentList, LikeList, Post } from 'types'
import Link from 'next/link'
type IPostFooter = {
  post: Post
  id: string
}

function PostFooter({ post, id }: IPostFooter) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const model = pb.authStore.model
  const isLikedfilter = encodeURIComponent(
    `post='${post.id}'&&profile='${model?.id}'`,
  )

  const likes = useSWR(
    `${api_Url}collections/likes/records?filter=(post='${post.id}')`,
    fetcher,
  ) as { data: LikeList }

  const comments = useSWR(
    `${api_Url}collections/comments/records?filter=(post='${post.id}')`,
    fetcher,
  ) as { data: CommentList }

  const isLiked = useSWR(
    `${api_Url}collections/likes/records?filter=(${isLikedfilter})`,
    fetcher,
  ) as { data: LikeList }
  if (!likes.data || !comments.data || !isLiked.data)
    return (
      <div className="absolute left-6 bottom-14 z-10 s:bottom-6">
        <PostFooterSkeleton />
      </div>
    )

  const liked = isLiked.data.totalItems > 0 ? true : false
  return (
    <div className="absolute bottom-0 w-full p-6 pb-12 text-white bg-gradient-to-t from-custom-shadow sm:pb-6 ">
      <Link href={`/posts/${post.id}`}>
        <p className="py-4">{post.caption}</p>
      </Link>
      <div className="flex gap-4 items-center">
        <LikeButton
          totalLikes={likes.data.totalItems}
          liked={liked}
          postId={post.id}
          id={id}
        />
        <Link href={`/posts/${post.id}/comments`}>
          <p>{comments.data.totalItems} Comments</p>
        </Link>
      </div>
    </div>
  )
}

export default PostFooter
