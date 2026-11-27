'use client'

import { useCallback } from 'react'
import { loadLikes } from '@/lib/actions/social'
import type { LikeItem, Page } from '@/lib/pocketbase/types'
import { PeopleList } from './people-list'

export function LikesList({ postId, initial }: { postId: string; initial: Page<LikeItem> }) {
  const loadPage = useCallback((page: number) => loadLikes(postId, page), [postId])
  return <PeopleList initial={initial} loadPage={loadPage} emptyTitle="No likes yet" />
}
