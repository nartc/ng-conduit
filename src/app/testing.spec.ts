import type { Article, Profile } from './shared/data-access/api';

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
    author: getMockedProfile(profile),
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
  };
}
