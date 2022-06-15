import { Comment } from './api';

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';
export type CommentWithOwner = Comment & { isOwner: boolean };
