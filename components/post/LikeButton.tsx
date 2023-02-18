'use client'
import { useRouter } from 'next/navigation'
import { useReducer, useState } from 'react'
import { pb } from '../../utils/pocketbase'
import useSWR, { useSWRConfig } from 'swr'
import { api_Url } from 'utils/consts'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
type ILikdButton = {
  liked: Boolean
  postId: string
  id: string
  totalLikes: number
}

function LikeButton({ liked, postId, id, totalLikes }: ILikdButton) {
  const { mutate } = useSWRConfig()
  const [isLiked, setIsLiked] = useState(liked)
  const [likes, setLikes] = useState(totalLikes)
  const router = useRouter()
  const model = pb.authStore.model

  const addLike = async () => {
    if (!model) {
      router.replace('/account/login')
    }
    try {
      const data = {
        post: postId,
        profile: id,
      }
      await pb.collection('likes').create(data)
    } catch (e) {
      console.log(e)
    }
  }
  const deleteLike = async () => {
    try {
      const resultList = await pb.collection('likes').getList(1, 1, {
        filter: `post = "${postId}" && profile = "${id}"`,
      })
      const likeId = resultList.items[0].id
      const record = await pb.collection('likes').delete(likeId)
    } catch (e) {
      console.log(e)
    }
  }

  const toggleLike = async () => {
    if (!isLiked) {
      addLike()
      setLikes(likes + 1)
    } else {
      deleteLike()
      setLikes(likes - 1)
    }
    setIsLiked(!isLiked)
    await mutate(
      `${api_Url}collections/likes/records?filter=(post='${postId}')`,
      true,
    )
    await mutate(
      `${api_Url}collections/likes/records?filter=post='${postId}'&profile='${model?.id}'`,
      true,
    )
  }

  return (
    <div className="flex gap-1 p-3 px-4 pr-5 rounded-full bg-zinc-200 bg-opacity-30 backdrop-blur-sm">
      {isLiked ? (
        <button onClick={toggleLike}>
          <HeartFilledIcon className="text-red-600 " width={24} height={24} />
        </button>
      ) : (
        <button onClick={toggleLike}>
          <HeartIcon width={24} height={24} />
        </button>
      )}
      <Link href={`/posts/${postId}/likes`}>
        <p>{likes} Likes </p>
      </Link>
    </div>
  )
}

export default LikeButton
