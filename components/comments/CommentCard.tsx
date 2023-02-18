import { pb } from 'utils/pocketbase'
import useSWR, { useSWRConfig } from 'swr'
import { Avatar, Date } from 'components/UI'
import { Comment } from 'types'
import { TrashIcon } from '@radix-ui/react-icons'
type Props = {
  data: Comment
  onDelete: any
}
function CommentCard({ data, onDelete }: Props) {
  const model = pb.authStore.model

  const { mutate } = useSWRConfig()
  const handleDelete = async () => {
    await pb.collection('comments').delete(data.id)
    await onDelete()
    await mutate(
      `http://127.0.0.1:8090/api/collections/comments/records?filter=(post='${data.post}')`,
      true,
    )
  }

  return (
    <div className="flex gap-5 mb-8 items-start">
      <Avatar user={data.expand.profile} size={56} />
      <div className="flex-grow">
        <p className="text-sm font-semibold">{data.expand.profile.name}</p>
        {data.content}
      </div>
      <Date date={data.created} />
      {model && (
        <>
          {data.profile === model.id ? (
            <button onClick={handleDelete}>
              <TrashIcon className="text-zinc-400" />
            </button>
          ) : null}
        </>
      )}
    </div>
  )
}

export default CommentCard
