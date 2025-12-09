export type PostType = 'admin' | 'guestbook';

export type PostStatus = 'approved' | 'pending' | 'rejected';

export interface Post {
  id: string;
  type: PostType;
  author: string;
  content: string;
  image?: string;
  timestamp: number;
  status: PostStatus;
  ip?: string; // Only visible to admin
}

export interface NewPostPayload {
  author: string;
  content: string;
  image?: string;
  type: PostType;
}
