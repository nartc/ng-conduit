import type { Article, Profile } from './shared/data-access/api';
import { CommentWithOwner } from './shared/data-access/models';

export function getMockedProfile(profile: Partial<Profile> = {}): Profile {
  return {
    following: false,
    bio: 'bio',
    username: 'username',
    image: 'image',
    ...profile,
  };
}

export function getMockedArticle(
  {
    profile,
    article,
  }: {
    profile?: Partial<Profile>;
    article?: Partial<Article>;
  } = { profile: {}, article: {} }
): Article {
  return {
    tagList: ['tag one', 'tag two'],
    body: 'body',
    favorited: false,
    title: 'article title',
    slug: 'article-title',
    favoritesCount: 5,
    description: 'description',
    createdAt: new Date('10/14/1991'),
    updatedAt: new Date('10/14/1991'),
    ...article,
    author: getMockedProfile(profile),
  };
}

export function getMockedCommentWithOwner(
  {
    profile,
    comment,
  }: { profile?: Partial<Profile>; comment?: Partial<CommentWithOwner> } = {
    profile: {},
    comment: {},
  }
): CommentWithOwner {
  return {
    isOwner: false,
    body: 'body',
    updatedAt: new Date('10/14/1991'),
    createdAt: new Date('10/14/1991'),
    id: 1,
    ...comment,
    author: getMockedProfile(profile),
  };
}
