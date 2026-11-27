'use server'

import { ClientResponseError } from 'pocketbase'
import { revalidatePath } from 'next/cache'
import { getActivityPage, getCommentsPage, getLikesPage } from '@/lib/data'
import { getCurrentUser, getServerClient, requireUser } from '@/lib/pocketbase/server'
import type { LikeRecord, PostStatsRecord } from '@/lib/pocketbase/types'
import { commentSchema, fieldErrors, pageNumber, recordId, type FormState } from '@/lib/validation'

export type ToggleLikeResult =
  | { ok: true; liked: boolean; likes: number }
  | { ok: false; reason: 'unauthenticated' }

export async function toggleLike(postId: string): Promise<ToggleLikeResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, reason: 'unauthenticated' }

  const id = recordId.parse(postId)
  const pb = await getServerClient()
  const mine = pb.filter('post = {:post} && author = {:me}', { post: id, me: user.id })

  let liked: boolean
  try {
    const existing = await pb.collection('likes').getFirstListItem<LikeRecord>(mine)
    await pb.collection('likes').delete(existing.id)
    liked = false
  } catch (error) {
    if (!(error instanceof ClientResponseError && error.status === 404)) throw error
    try {
      await pb.collection('likes').create({ post: id, author: user.id })
    } catch (createError) {
      // A double-click can race us here; the unique index already holds the like.
      if (!(createError instanceof ClientResponseError && createError.status === 400)) {
        throw createError
      }
    }
    liked = true
  }

  const stats = await pb.collection('post_stats').getOne<PostStatsRecord>(id)
  revalidatePath(`/posts/${id}/likes`)
  return { ok: true, liked, likes: stats.likes }
}

export async function addComment(
  postId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser()
  const input = commentSchema.safeParse({ content: formData.get('content') ?? '' })
  if (!input.success) return { fieldErrors: fieldErrors(input.error) }

  const id = recordId.parse(postId)
  const pb = await getServerClient()
  await pb.collection('comments').create({ post: id, author: user.id, content: input.data.content })

  revalidatePath(`/posts/${id}`)
  return {}
}

export async function deleteComment(commentId: string, postId: string) {
  await requireUser()
  const pb = await getServerClient()
  // The `deleteRule` only lets authors delete their own comments.
  await pb.collection('comments').delete(recordId.parse(commentId))
  revalidatePath(`/posts/${recordId.parse(postId)}`)
}

export async function loadComments(postId: string, page: number) {
  return getCommentsPage(recordId.parse(postId), pageNumber.parse(page))
}

export async function loadLikes(postId: string, page: number) {
  return getLikesPage(recordId.parse(postId), pageNumber.parse(page))
}

export async function loadActivity(page: number) {
  const user = await requireUser()
  return getActivityPage(user.id, pageNumber.parse(page))
}
