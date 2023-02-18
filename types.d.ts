interface BaseList {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

interface Item {
  id: string
  created: string
  updated: string
  collectionId: string
  collectionName: string
}

export interface UserList extends BaseList {
  items: User[]
}

export interface PostList extends BaseList {
  items: Post[]
}

export interface LikeList extends BaseList {
  items: Like[]
}

export interface CommentList extends BaseList {
  items: Comment[]
}

export interface NotificationList extends BaseList {
  items: Notification[]
}

export interface User extends Item {
  avatar: string
  bio: string
  emailVisibility: boolean
  name: string
  username: string
  verified: boolean
  email?: string | null
}

export interface Post extends Item {
  caption: string
  fileUrl: string
  profile: string
  expand: {
    profile: User
  }
}

export interface Like extends Item {
  post: string | Post
  profile: string
  expand: {
    profile: User
  }
}

export interface Comment extends Item {
  content: string
  post: string | Post
  profile: string
  expand: {
    profile: User
  }
}

export interface Notification extends Item {
  post: string | Post
  profile: string
  expand: {
    profile: User
    post: Post
  }
}
