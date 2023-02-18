import InfiniteComments from 'components/comments/InfiniteComments'
import { Avatar, Date } from 'components/UI'
import { Post } from 'types'
import { api_Url } from 'utils/consts'
import DeleteButton from './DeleteButton'
import { useUser } from 'utils/useUser'
type PageProps = {
  params: {
    id: string
  }
  children?: React.ReactNode
}

async function Page({ params }: PageProps) {
  const postId = params.id
  const user = useUser()
  const userId = user?.model?.id || ''

  const post = (await fetch(
    `${api_Url}collections/posts/records/${postId}?expand=profile`,
  ).then((res) => res.json())) as Post

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex gap-4 items-center">
        <Avatar user={post.expand.profile} size={56} />
        <div className="flex-grow">
          <p>{post.expand.profile.name}</p>
          <p className="text-sm text-zinc-400">
            {post.expand.profile.username}
          </p>
        </div>
        <Date date={post.created} />
        {post.expand.profile.id == userId && <DeleteButton postId={post.id} />}
      </div>
      <p>{post.caption}</p>
      <div className="w-full bg-zinc-200 h-[1px]"></div>
      <InfiniteComments postId={postId} />
    </div>
  )
}

export default Page
