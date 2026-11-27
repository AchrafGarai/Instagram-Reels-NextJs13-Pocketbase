'use client'

import { startTransition } from 'react'
import Link from 'next/link'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  ExitIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  PlusIcon,
} from '@radix-ui/react-icons'
import { Avatar } from '@/components/ui/avatar'
import { logout } from '@/lib/actions/auth'
import type { Profile } from '@/lib/pocketbase/types'

const itemClass =
  'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none data-[highlighted]:bg-zinc-100'

export function UserMenu({ user }: { user: Profile }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        className="rounded-full ring-2 ring-white/70 sm:ring-0"
        aria-label="Open account menu"
      >
        <Avatar user={user} size={36} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-56 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl"
        >
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-zinc-500">@{user.username}</p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-zinc-100" />
          <DropdownMenu.Item asChild className={`${itemClass} sm:hidden`}>
            <Link href="/">
              <HomeIcon /> Home
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={`${itemClass} sm:hidden`}>
            <Link href="/search">
              <MagnifyingGlassIcon /> Search
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={`${itemClass} sm:hidden`}>
            <Link href="/create">
              <PlusIcon /> New reel
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={itemClass}>
            <Link href={`/profile/${user.username}`}>
              <PersonIcon /> Profile
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/activity">
              <HeartIcon /> Activity
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-zinc-100" />
          {/* Not a <form>: the menu unmounts its content before a submit could fire. */}
          <DropdownMenu.Item className={itemClass} onSelect={() => startTransition(logout)}>
            <ExitIcon /> Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
