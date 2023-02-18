import { Like } from 'types'
import { Date, Avatar, ButtonLink } from 'components/UI'

function LikeCard({ data }: { data: Like }) {
  return (
    <div className="flex gap-2 items-center mb-5">
      <Avatar user={data.expand.profile} size={56} />
      <div className="flex-grow">
        <p className="text-sm font-semibold">{data.expand.profile.name}</p>
        <p className="text-sm text-zinc-400">{data.expand.profile.username}</p>
      </div>
      <Date date={data.created} />
    </div>
  )
}

export default LikeCard
