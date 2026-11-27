import type {
  CommentRecord,
  CommentItem,
  FeedPost,
  LikeItem,
  LikeRecord,
  PostRecord,
  Profile,
  UserRecord,
} from './types'

const PUBLIC_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL ?? 'http://127.0.0.1:8090'

/** Public URL of a file stored on a record, with an optional PocketBase thumb size. */
export function fileUrl(
  record: { collectionId: string; id: string },
  filename: string,
  thumb?: string,
) {
  const url = new URL(
    `/api/files/${record.collectionId}/${record.id}/${encodeURIComponent(filename)}`,
    PUBLIC_URL,
  )
  if (thumb) url.searchParams.set('thumb', thumb)
  return url.toString()
}

export function toProfile(user: UserRecord): Profile {
  return {
    id: user.id,
    username: user.username,
    name: user.name || user.username,
    bio: user.bio ?? '',
    avatarUrl: user.avatar ? fileUrl(user, user.avatar, '200x200') : null,
  }
}

function expandedAuthor(record: { expand?: { author?: UserRecord } }): Profile {
  const author = record.expand?.author
  if (!author) throw new Error('Expected the `author` relation to be expanded')
  return toProfile(author)
}

export function toFeedPost(
  post: PostRecord,
  stats: { likes: number; comments: number; likedByMe: boolean },
): FeedPost {
  return {
    id: post.id,
    caption: post.caption,
    videoUrl: fileUrl(post, post.video),
    created: post.created,
    author: expandedAuthor(post),
    ...stats,
  }
}

export function toCommentItem(comment: CommentRecord): CommentItem {
  return {
    id: comment.id,
    content: comment.content,
    created: comment.created,
    author: expandedAuthor(comment),
  }
}

export function toLikeItem(like: LikeRecord): LikeItem {
  return { id: like.id, created: like.created, author: expandedAuthor(like) }
}
