'use client'

import { useTransition } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { DotsHorizontalIcon, TrashIcon } from '@radix-ui/react-icons'
import { deletePost } from '@/lib/actions/posts'

export function PostMenu({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100"
        aria-label="Post options"
        disabled={isPending}
      >
        <DotsHorizontalIcon width={20} height={20} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-44 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl"
        >
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 outline-none data-[highlighted]:bg-red-50"
            onSelect={() => {
              if (window.confirm('Delete this reel? This can’t be undone.')) {
                startTransition(() => deletePost(postId))
              }
            }}
          >
            <TrashIcon /> Delete reel
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
