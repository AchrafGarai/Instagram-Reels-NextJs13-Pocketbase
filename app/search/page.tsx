import React from 'react'
import InfinitePosts from 'components/post/InfinitePosts'
import Error from 'components/UI/Error'
type Props = {
  params?: {
    num?: string
  }
  searchParams: {
    q: string
  }
}
async function SearchPage({ searchParams }: Props) {
  const { q } = searchParams

  return (
    <div className="container">
      {q ? (
        <InfinitePosts searchQuery={q} />
      ) : (
        <Error message={'no posts found..'} />
      )}
    </div>
  )
}

export default SearchPage
