'use client'
import useSWRInfinite from 'swr/infinite'
import CreateComment from './create/CreateComment'
import InfiniteCommentsPage from './InfiniteCommentsPage'
import Error from 'components/UI/Error'
import Loading from 'components/UI/Loading'
import InfiniteScroll from 'react-infinite-scroll-component'
import { pb } from 'utils/pocketbase'
import { ScrollEnd } from 'components/UI'
import { api_Url } from 'utils/consts'

const pageSize = 4
const fetcher = (url: string) => fetch(url).then((res) => res.json())

function InfiniteComments({ postId }: { postId: string }) {
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (index) =>
      `${api_Url}collections/comments/records?filter=post="${postId}"&page=${
        index + 1
      }&perPage=${pageSize}&sort=-created&expand=profile`,
    fetcher,
  )
  const model = pb.authStore.isValid

  // ... handle loading and error states
  if (error) return <Error message="An error has occurred." />
  if (!data) return <Loading />

  // ... handle loading empty response
  if (data[0].totalItems === 0)
    return (
      <>
        <p>No comments...</p>
        <CreateComment postId={postId} onMutate={mutate} />
      </>
    )

  // ... Calculate totla items
  let totalPages = 0
  for (let i = 0; i < data.length; i++) {
    totalPages += data[i].items.length
  }

  const comments = data ? [].concat(...data) : []

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
        dataLength={comments.length} //This is important field to render the next data
        next={loadMore}
        hasMore={isReachingEnd}
        loader={<h4>Loading...</h4>}
        endMessage={<ScrollEnd />}
      >
        {comments.map((page: any) => {
          return (
            <InfiniteCommentsPage
              key={page.items[0].id}
              data={page.items}
              onMutate={handleDelte}
            />
          )
        })}
      </InfiniteScroll>
      {model && <CreateComment postId={postId} onMutate={mutate} />}
    </div>
  )
}

export default InfiniteComments
