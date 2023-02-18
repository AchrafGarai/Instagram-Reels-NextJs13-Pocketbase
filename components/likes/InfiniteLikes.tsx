'use client'
import Loading from 'components/UI/Loading'
import Error from 'components/UI/Error'
import useSWRInfinite from 'swr/infinite'
import InfiniteLikesPage from './InfiniteLikesPage'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ScrollEnd } from 'components/UI'
import { api_Url } from 'utils/consts'
const pageSize = 4
const fetcher = (url: string) => fetch(url).then((res) => res.json())

function InfiniteLikes({ postId }: { postId: string }) {
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (index) =>
      `${api_Url}collections/likes/records?filter=post="${postId}"&page=${
        index + 1
      }&perPage=${pageSize}&sort=-created&expand=profile`,
    fetcher,
  )
  // ... handle loading and error states
  if (error) return <Error message="An error has occurred." />
  if (!data) return <Loading />

  // ... handle loading empty response
  if (data[0].totalItems === 0) return <p>No likes...</p>

  // ... Calculate totla items
  let totalPages = 0
  for (let i = 0; i < data.length; i++) {
    totalPages += data[i].items.length
  }

  const likes = data ? [].concat(...data) : []

  const isReachingEnd =
    data.length * pageSize < data[data.length - 1].totalItems

  // ... Mutating pages on deleting a comment
  const handleDelte = async () => {
    await mutate()
    if (size > totalPages / pageSize && size > 1) {
      setSize(size - 1)
    }
  }

  const loadMore = () => {
    setSize(size + 1)
  }

  return (
    <div>
      <InfiniteScroll
        dataLength={data.length} //This is important field to render the next data
        next={loadMore}
        hasMore={isReachingEnd}
        loader={<h4>Loading...</h4>}
        endMessage={<ScrollEnd />}
      >
        {likes.map((page: any) => {
          return <InfiniteLikesPage key={page.items[0].id} data={page.items} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default InfiniteLikes
