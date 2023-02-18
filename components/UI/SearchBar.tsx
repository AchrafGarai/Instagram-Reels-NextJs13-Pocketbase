'use client'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

function SearchBar() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearch('')
    router.push(`/search/?q=${search}`)
  }

  return (
    <form
      className="p-4 rounded-full bg-zinc-100 flex items-center gap-4 border border-zinc-200 focus:border-zinc-400"
      onSubmit={handleSearch}
    >
      <input
        type="text"
        placeholder="Search for reels"
        className=" bg-inherit focus:outline-none w-full"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className=" border-l h-6 border-zinc-300"></div>
      <button type="submit">
        <MagnifyingGlassIcon
          className=" text-zinc-400"
          width={24}
          height={24}
        />
      </button>
    </form>
  )
}

export default SearchBar
