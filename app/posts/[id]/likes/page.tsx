import InfiniteLikes from 'components/likes/InfiniteLikes'
import { LikeList } from 'types'
import { api_Url } from 'utils/consts'
import { BackButton } from 'components/UI'

type PageProps = {
  params: {
    id: string
  }
  children?: React.ReactNode
}

async function LikesPage({ params }: PageProps) {
  const postId = params.id
  const likes = (await fetch(
    `${api_Url}collections/likes/records?perpage=1&page=1&filter=(post="${postId}")`,
  ).then((res) => res.json())) as LikeList

  return (
    <>
      <div className="flex gap-4 items-center mb-9">
        <BackButton />
        <h1 className="flex-grow text-lg font-semibold">Likes</h1>
        <p className="text-lg font-semibold">{likes.totalItems}</p>
      </div>
      <div className="bg-zinc-200 h-[1px] w-full mb-9"></div>
      <InfiniteLikes postId={postId} />
    </>
  )
}

export default LikesPage
