import 'server-only'

import { ClientResponseError } from 'pocketbase'
import type PocketBase from 'pocketbase'
import { getServerClient } from './pocketbase/server'
import { toCommentItem, toFeedPost, toLikeItem, toProfile } from './pocketbase/mappers'
import type {
  ActivityItem,
  CommentItem,
  CommentRecord,
  FeedPost,
  LikeItem,
  LikeRecord,
  Page,
  PostRecord,
  PostStatsRecord,
  Profile,
  UserRecord,
} from './pocketbase/types'
import type { FeedScope } from './validation'

export const FEED_PAGE_SIZE = 4
export const LIST_PAGE_SIZE = 12

/**
 * Data access layer. Every query goes through the per-request client, so
 * PocketBase's access rules apply as the current visitor, and every
 * user-supplied value is bound with `pb.filter` instead of being concatenated
 * into the filter string.
 */

/** `field = a || field = b || ...` with each id bound as a parameter. */
function anyOf(pb: PocketBase, field: string, ids: string[]) {
  const params = Object.fromEntries(ids.map((id, i) => [`v${i}`, id]))
  return pb.filter(ids.map((_, i) => `${field} = {:v${i}}`).join(' || '), params)
}

function feedFilter(pb: PocketBase, scope: FeedScope) {
  switch (scope.kind) {
    case 'all':
      return ''
    case 'author':
      return pb.filter('author = {:id}', { id: scope.authorId })
    case 'search':
      return pb.filter('caption ~ {:q} || author.username ~ {:q} || author.name ~ {:q}', {
        q: scope.query,
      })
  }
}

/** Adds like/comment counts and the visitor's own like, in two queries per page. */
async function withStats(pb: PocketBase, posts: PostRecord[]): Promise<FeedPost[]> {
  if (posts.length === 0) return []

  const ids = posts.map((post) => post.id)
  const viewerId = pb.authStore.record?.id

  const [stats, viewerLikes] = await Promise.all([
    pb.collection('post_stats').getFullList<PostStatsRecord>({ filter: anyOf(pb, 'id', ids) }),
    viewerId
      ? pb.collection('likes').getFullList<LikeRecord>({
          filter: `(${anyOf(pb, 'post', ids)}) && ${pb.filter('author = {:me}', { me: viewerId })}`,
          fields: 'post',
        })
      : Promise.resolve([]),
  ])

  const statsById = new Map(stats.map((row) => [row.id, row]))
  const liked = new Set(viewerLikes.map((like) => like.post))

  return posts.map((post) =>
    toFeedPost(post, {
      likes: statsById.get(post.id)?.likes ?? 0,
      comments: statsById.get(post.id)?.comments ?? 0,
      likedByMe: liked.has(post.id),
    }),
  )
}

export async function getFeedPage(scope: FeedScope, page = 1): Promise<Page<FeedPost>> {
  const pb = await getServerClient()
  const result = await pb.collection('posts').getList<PostRecord>(page, FEED_PAGE_SIZE, {
    sort: '-created,-id',
    filter: feedFilter(pb, scope),
    expand: 'author',
  })

  return {
    items: await withStats(pb, result.items),
    page,
    totalItems: result.totalItems,
    hasMore: page < result.totalPages,
  }
}

function isNotFound(error: unknown) {
  return error instanceof ClientResponseError && error.status === 404
}

export async function getPost(id: string): Promise<FeedPost | null> {
  const pb = await getServerClient()
  try {
    const post = await pb.collection('posts').getOne<PostRecord>(id, { expand: 'author' })
    const [withCounts] = await withStats(pb, [post])
    return withCounts
  } catch (error) {
    if (isNotFound(error)) return null
    throw error
  }
}

export async function getProfile(
  username: string,
): Promise<{ profile: Profile; postCount: number } | null> {
  const pb = await getServerClient()
  try {
    const user = await pb
      .collection('users')
      .getFirstListItem<UserRecord>(pb.filter('username = {:username}', { username }))
    const posts = await pb.collection('posts').getList(1, 1, {
      filter: pb.filter('author = {:id}', { id: user.id }),
      fields: 'id',
    })
    return { profile: toProfile(user), postCount: posts.totalItems }
  } catch (error) {
    if (isNotFound(error)) return null
    throw error
  }
}

export async function getCommentsPage(postId: string, page = 1): Promise<Page<CommentItem>> {
  const pb = await getServerClient()
  const result = await pb.collection('comments').getList<CommentRecord>(page, LIST_PAGE_SIZE, {
    sort: '-created,-id',
    filter: pb.filter('post = {:postId}', { postId }),
    expand: 'author',
  })
  return {
    items: result.items.map(toCommentItem),
    page,
    totalItems: result.totalItems,
    hasMore: page < result.totalPages,
  }
}

export async function getLikesPage(postId: string, page = 1): Promise<Page<LikeItem>> {
  const pb = await getServerClient()
  const result = await pb.collection('likes').getList<LikeRecord>(page, LIST_PAGE_SIZE, {
    sort: '-created,-id',
    filter: pb.filter('post = {:postId}', { postId }),
    expand: 'author',
  })
  return {
    items: result.items.map(toLikeItem),
    page,
    totalItems: result.totalItems,
    hasMore: page < result.totalPages,
  }
}

/** Likes other people left on the viewer's posts. */
export async function getActivityPage(viewerId: string, page = 1): Promise<Page<ActivityItem>> {
  const pb = await getServerClient()
  const result = await pb.collection('likes').getList<LikeRecord>(page, LIST_PAGE_SIZE, {
    sort: '-created,-id',
    filter: pb.filter('post.author = {:me} && author != {:me}', { me: viewerId }),
    expand: 'author',
  })
  return {
    items: result.items.map((like) => ({ ...toLikeItem(like), postId: like.post })),
    page,
    totalItems: result.totalItems,
    hasMore: page < result.totalPages,
  }
}
