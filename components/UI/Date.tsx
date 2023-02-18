'use client'

import TimeAgo from 'react-timeago'
function Date({ date }: { date: string }) {
  return (
    <>
      <TimeAgo className="text-xs text-zinc-400" date={date} />
    </>
  )
}

export default Date
