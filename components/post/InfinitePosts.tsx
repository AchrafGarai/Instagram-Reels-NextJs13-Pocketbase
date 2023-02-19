'use client'
import Loading from 'components/UI/Loading'
import Error from 'components/UI/Error'
import useSWRInfinite from 'swr/infinite'
import InfinitePostsPage from './InfinitePostsPage'
import InfiniteScroll from 'react-infinite-scroll-component'
import { api_Url } from 'utils/consts'
import { ScrollEnd } from 'components/UI'
import { InView } from 'react-intersection-observer'
import { useState } from 'react'
import { PostSkeleton } from 'components/UI'
import { PostList } from 'types'

const pageSize = 2
const fetcher = (url: string) => fetch(url).then((res) => res.json())

type Props = {
  searchQuery?: string
  userId?: string
}

function InfinitePosts({ userId, searchQuery }: Props) {
  let searchParam = ''
  if (searchQuery) {
    searchParam = `&filter=(caption~'${searchQuery}')`
  }
  let filerParam = ''
  if (userId) {
    filerParam = `&filter=(profile='${userId}')`
  }
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (index) =>
      `${api_Url}collections/posts/records?page=${
        index + 1
      }&perPage=${pageSize}&sort=-created${filerParam}${searchParam}&expand=profile`,
    fetcher,
  )
  // ... handle loading and error states
  if (error) return <Error message="An error has occurred." />
  if (!data) return <PostSkeleton />

  // ... handle loading empty response
  if (data[0].totalItems === 0) return <Error message="No posts found..." />

  // ... Calculate totla items
  let totalPages = 0
  for (let i = 0; i < data.length; i++) {
    totalPages += data[i].items.length
  }

  const posts = data ? [].concat(...data) : []

  const isReachingEnd =
    data.length * pageSize < data[data.length - 1].totalItems

  // ... Mutating pages on deleting a comment
  const handleDelte = async () => {
    await mutate()
    if (size > totalPages / pageSize && size > 1) {
      setSize(size - 1)
    }
  }

  const handleLoadMore = () => {
    if (totalPages < data[0].totalItems) {
      setSize(size + 1)
      setHasNextPage(true)
    } else {
      setHasNextPage(false)
    }
  }

  return (
    <>
      {data && (
        <>
          <>
            {posts.map((page: PostList) => {
              return (
                <InfinitePostsPage
                  key={page.items[0].id}
                  data={page.items}
                  onMutate={handleDelte}
                />
              )
            })}
          </>
          {hasNextPage && (
            <InView
              onChange={(inView) => {
                if (inView) {
                  handleLoadMore()
                }
              }}
            >
              <Loading />
            </InView>
          )}
          {!hasNextPage && (
            <div className="h-screen snap-start flex flex-col items-center justify-center rounded-3xl mx-auto my-4">
              <ScrollEnd />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default InfinitePosts
