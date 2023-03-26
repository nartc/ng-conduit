import type { Article, Comment, Profile, User } from './shared/data-access/api';
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

export function getMockedUser(user: Partial<User> = {}): User {
    return {
        bio: 'bio',
        username: 'username',
        image: 'image',
        token: 'token',
        email: 'email',
        ...user,
    };
}

export function getMockedArticleComment(id: number, profile: Partial<Profile> = {}): Comment {
    return {
        id,
        createdAt: new Date('10/14/1991'),
        updatedAt: new Date('10/14/1991'),
        body: 'body',
        author: getMockedProfile(profile),
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
        authUser,
    }: {
        comment?: Partial<Comment>;
        profile: Profile;
        authUser: User;
    } = {
        comment: {},
        profile: getMockedProfile(),
        authUser: getMockedUser(),
    }
): CommentWithOwner {
    return {
        isOwner: profile.username === authUser.username,
        body: 'body',
        updatedAt: new Date('10/14/1991'),
        createdAt: new Date('10/14/1991'),
        id: 1,
        ...comment,
        author: profile,
    };
}
