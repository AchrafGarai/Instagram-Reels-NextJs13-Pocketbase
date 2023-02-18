'use client'
import Loading from 'components/UI/Loading'
import Error from 'components/UI/Error'
import useSWRInfinite from 'swr/infinite'
import InfiniteScroll from 'react-infinite-scroll-component'
import NotificationPage from './NotificationPage'
import { api_Url } from 'utils/consts'
import { pb } from 'utils/pocketbase'
import { ScrollEnd } from 'components/UI'

const pageSize = 4
const fetcher = (url: string) => fetch(url).then((res) => res.json())
const id = pb.authStore.model?.id

const filter = encodeURIComponent(`post.profile='${id}'&&profile!='${id}'`)

function NotificationList() {
  let isReachingEnd = false
  const { data, error, mutate, size, setSize } = useSWRInfinite(
    (index) =>
      `${api_Url}collections/likes/records?expand=post,profile&filter=(${filter})&page=${
        index + 1
      }&perPage=${pageSize}&sort=-created`,
    fetcher,
  )
  // ... handle loading and error states
  if (error) return <Error message="An error has occurred." />
  if (!data) return <Loading />

  const likes = data ? [].concat(...data) : []

  if (data) {
    // ... handle loading empty response
    if (data[0].totalItems === 0)
      return <Error message={"You don't have any notifications"} />

    // ... Calculate totla items
    let totalPages = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i].items) {
        totalPages += data[i].items.length
      }
    }
    isReachingEnd = data.length * pageSize < data[data.length - 1].totalItems
  }

  const loadMore = () => {
    setSize(size + 1)
  }

  return (
    <div className="container">
      {data && (
        <InfiniteScroll
          dataLength={data.length} //This is important field to render the next data
          next={loadMore}
          hasMore={isReachingEnd}
          loader={<h4>Loading...</h4>}
          endMessage={<ScrollEnd />}
        >
          {likes.map((page: any, index: number) => {
            return <NotificationPage key={index} notifications={page.items} />
          })}
        </InfiniteScroll>
      )}
    </div>
  )
}

export default NotificationList
