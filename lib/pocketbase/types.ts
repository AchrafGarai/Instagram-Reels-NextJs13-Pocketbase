import type { RecordModel } from 'pocketbase'

/* Raw PocketBase records, as returned by the SDK. -------------------------- */

export interface UserRecord extends RecordModel {
  username: string
  name: string
  bio: string
  avatar: string
}

export interface PostRecord extends RecordModel {
  author: string
  video: string
  caption: string
  created: string
  expand?: { author?: UserRecord }
}

export interface LikeRecord extends RecordModel {
  post: string
  author: string
  created: string
  expand?: { author?: UserRecord; post?: PostRecord }
}

export interface CommentRecord extends RecordModel {
  post: string
  author: string
  content: string
  created: string
  expand?: { author?: UserRecord }
}

export interface PostStatsRecord extends RecordModel {
  likes: number
  comments: number
}

/* View models: plain, serialisable objects passed to components. ----------- */

export interface Profile {
  id: string
  username: string
  name: string
  bio: string
  avatarUrl: string | null
}

export interface FeedPost {
  id: string
  caption: string
  videoUrl: string
  created: string
  author: Profile
  likes: number
  comments: number
  likedByMe: boolean
}

export interface CommentItem {
  id: string
  content: string
  created: string
  author: Profile
}

export interface LikeItem {
  id: string
  created: string
  author: Profile
}

export interface ActivityItem {
  id: string
  created: string
  author: Profile
  postId: string
}

export interface Page<T> {
  items: T[]
  page: number
  totalItems: number
  hasMore: boolean
}
