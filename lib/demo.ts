import 'server-only'

import type {
  CommentItem,
  FeedPost,
  LikeItem,
  Page,
  Profile,
} from './pocketbase/types'
import type { FeedScope } from './validation'

/**
 * Static, read-only sample data used when PocketBase can't be reached (for
 * example on a preview deployment with no backend). It returns the same view
 * models as the live data layer, so pages render unchanged.
 */

const profiles = {
  maya: {
    id: 'demomaya0000001',
    username: 'maya',
    name: 'Maya Chen',
    bio: 'Motion designer. Loops, gradients and good coffee.',
    avatarUrl: null,
  },
  leo: {
    id: 'demoleo00000001',
    username: 'leo',
    name: 'Leo Martins',
    bio: 'Street food and city walks.',
    avatarUrl: null,
  },
  amira: {
    id: 'demoamira000001',
    username: 'amira',
    name: 'Amira Haddad',
    bio: 'Climbing, film photography, slow travel.',
    avatarUrl: null,
  },
} satisfies Record<string, Profile>

type Username = keyof typeof profiles

const HOUR = 60 * 60 * 1000
/** Fixed reference time so prerendered pages are stable between builds. */
const EPOCH = Date.UTC(2026, 0, 15, 12)
const at = (hoursAgo: number) => new Date(EPOCH - hoursAgo * HOUR).toISOString()

const reels: { by: Username; caption: string; hoursAgo: number }[] = [
  { by: 'maya', caption: 'Testing a new gradient loop 🌀', hoursAgo: 2 },
  { by: 'leo', caption: 'Sunset run along the river', hoursAgo: 5 },
  { by: 'amira', caption: 'Morning light over the valley', hoursAgo: 9 },
  { by: 'maya', caption: 'Colour study #2: warm to cool', hoursAgo: 20 },
  { by: 'leo', caption: 'Golden hour in the old town', hoursAgo: 30 },
  { by: 'amira', caption: 'Fog rolling in at the coast', hoursAgo: 48 },
]

const commentTexts = ['This is so good', 'The colours 😍', 'Need more of these', 'Saving this one']

const posts = reels.map((reel, index) => ({
  id: `demopost${String(index + 1).padStart(7, '0')}`,
  caption: reel.caption,
  videoUrl: `/demo/reel-${index + 1}.mp4`,
  created: at(reel.hoursAgo),
  author: profiles[reel.by],
}))

const others = (username: Username) =>
  (Object.keys(profiles) as Username[]).filter((name) => name !== username)

const likes = new Map<string, LikeItem[]>(
  posts.map((post, index) => [
    post.id,
    others(reels[index].by).map((name, i) => ({
      id: `${post.id}-like-${i}`,
      created: at(reels[index].hoursAgo - 0.5 - i),
      author: profiles[name],
    })),
  ]),
)

const comments = new Map<string, CommentItem[]>(
  posts.map((post, index) => [
    post.id,
    others(reels[index].by).map((name, i) => ({
      id: `${post.id}-comment-${i}`,
      content: commentTexts[(index + i) % commentTexts.length],
      created: at(reels[index].hoursAgo - 1 - i),
      author: profiles[name],
    })),
  ]),
)

function toFeedPost(post: (typeof posts)[number]): FeedPost {
  return {
    ...post,
    likes: likes.get(post.id)?.length ?? 0,
    comments: comments.get(post.id)?.length ?? 0,
    likedByMe: false,
  }
}

function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const start = (page - 1) * size
  return {
    items: items.slice(start, start + size),
    page,
    totalItems: items.length,
    hasMore: start + size < items.length,
  }
}

function matches(scope: FeedScope, post: (typeof posts)[number]) {
  switch (scope.kind) {
    case 'all':
      return true
    case 'author':
      return post.author.id === scope.authorId
    case 'search': {
      const query = scope.query.toLowerCase()
      return [post.caption, post.author.username, post.author.name].some((text) =>
        text.toLowerCase().includes(query),
      )
    }
  }
}

export const demo = {
  feedPage(scope: FeedScope, page: number, size: number) {
    return paginate(posts.filter((post) => matches(scope, post)).map(toFeedPost), page, size)
  },

  post(id: string) {
    const post = posts.find((candidate) => candidate.id === id)
    return post ? toFeedPost(post) : null
  },

  profile(username: string) {
    const profile = profiles[username as Username]
    if (!profile) return null
    return {
      profile,
      postCount: posts.filter((post) => post.author.id === profile.id).length,
    }
  },

  commentsPage(postId: string, page: number, size: number) {
    return paginate(comments.get(postId) ?? [], page, size)
  },

  likesPage(postId: string, page: number, size: number) {
    return paginate(likes.get(postId) ?? [], page, size)
  },
}
