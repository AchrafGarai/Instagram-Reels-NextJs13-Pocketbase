'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getFeedPage } from '@/lib/data'
import { getServerClient, requireUser } from '@/lib/pocketbase/server'
import {
  createPostSchema,
  feedScope,
  fieldErrors,
  pageNumber,
  recordId,
  type FeedScope,
  type FormState,
} from '@/lib/validation'

/** Next page of a feed, for infinite scrolling. */
export async function loadFeedPage(scope: FeedScope, page: number) {
  return getFeedPage(feedScope.parse(scope), pageNumber.parse(page))
}

export async function createPost(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser()
  const input = createPostSchema.safeParse({
    caption: formData.get('caption') ?? '',
    video: formData.get('video'),
  })
  if (!input.success) {
    return {
      fieldErrors: fieldErrors(input.error),
      values: { caption: String(formData.get('caption') ?? '') },
    }
  }

  const pb = await getServerClient()
  const post = await pb.collection('posts').create({ ...input.data, author: user.id })

  revalidatePath('/')
  revalidatePath(`/profile/${user.username}`)
  redirect(`/posts/${post.id}`)
}

export async function deletePost(postId: string) {
  const user = await requireUser()
  const pb = await getServerClient()
  // The `deleteRule` makes PocketBase reject this unless the viewer is the author.
  await pb.collection('posts').delete(recordId.parse(postId))

  revalidatePath('/')
  revalidatePath(`/profile/${user.username}`)
  redirect(`/profile/${user.username}`)
}
