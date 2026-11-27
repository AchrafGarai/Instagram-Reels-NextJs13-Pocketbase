'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

export function SearchForm({ autoFocus }: { autoFocus?: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <form
      role="search"
      className="relative w-full max-w-sm"
      onSubmit={(event) => {
        event.preventDefault()
        const query = String(new FormData(event.currentTarget).get('q') ?? '').trim()
        if (query) router.push(`/search?q=${encodeURIComponent(query)}`)
      }}
    >
      <MagnifyingGlassIcon
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-400"
        width={18}
        height={18}
      />
      <input
        name="q"
        type="search"
        defaultValue={searchParams.get('q') ?? ''}
        placeholder="Search reels and people"
        aria-label="Search"
        autoFocus={autoFocus}
        className="w-full rounded-full bg-zinc-100 py-2.5 pr-4 pl-11 text-sm placeholder:text-zinc-500 focus:bg-white focus:ring-2 focus:ring-accent focus:outline-none"
      />
    </form>
  )
}
