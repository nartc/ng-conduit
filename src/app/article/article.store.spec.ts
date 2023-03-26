import { ActivatedRoute, Params, Router } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { render } from '@testing-library/angular';
import { EMPTY, Observable, of, ReplaySubject, take, throwError } from 'rxjs';
import { ApiClient, Profile, User } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import {
    getMockedArticle,
    getMockedArticleComment,
    getMockedCommentWithOwner,
    getMockedProfile,
    getMockedUser,
} from '../testing.spec';
import { ArticleStore } from './article.store';

describe(ArticleStore.name, () => {
    let store: ArticleStore;

    let mockedParams: ReplaySubject<Params>;
    let mockedAuth: ReplaySubject<{
        isAuthenticated: boolean;
        user: User | null;
        profile: Profile | null;
    }>;

    let mockedApiClient: jasmine.SpyObj<ApiClient>;
    let mockedRoute: jasmine.SpyObj<ActivatedRoute>;
    let mockedRouter: jasmine.SpyObj<Router>;
    let mockedAuthStore: jasmine.SpyObj<AuthStore>;

    const mockedProfile = getMockedProfile();
    const mockedUser = getMockedUser();
    const mockedArticle = getMockedArticle({ profile: mockedProfile });
    const mockedSlug = mockedArticle.slug;
    const mockedComments = [
        getMockedCommentWithOwner({
            profile: mockedProfile,
            authUser: mockedUser,
        }),
        getMockedCommentWithOwner({
            comment: getMockedArticleComment(2),
            profile: getMockedProfile({ username: 'username-two' }),
            authUser: mockedUser,
        }),
    ];

    async function setup(getArticleStatus: 'success' | 'failure' | 'idle' = 'idle') {
        mockedParams = new ReplaySubject<Params>(1);
        mockedParams.next({ slug: mockedSlug });

        mockedAuth = new ReplaySubject(1);
        mockedAuth.next({
            isAuthenticated: true,
            profile: mockedProfile,
            user: mockedUser,
        });

        mockedApiClient = jasmine.createSpyObj<ApiClient>(ApiClient.name, [
            'getArticle',
            'getArticleComments',
            'deleteArticleFavorite',
            'createArticleFavorite',
            'deleteArticle',
            'unfollowUserByUsername',
            'followUserByUsername',
            'createArticleComment',
            'deleteArticleComment',
        ]);

        if (getArticleStatus === 'success') {
            mockedApiClient.getArticle.withArgs(mockedSlug).and.returnValue(of({ article: mockedArticle }));
            mockedApiClient.getArticleComments.withArgs(mockedSlug).and.returnValue(of({ comments: mockedComments }));
        } else if (getArticleStatus === 'failure') {
            mockedApiClient.getArticle.withArgs(mockedSlug).and.returnValue(throwError(() => 'error get article'));
            mockedApiClient.getArticleComments
                .withArgs(mockedSlug)
                .and.returnValue(throwError(() => 'error get article comments'));
        } else {
            mockedApiClient.getArticle.withArgs(mockedSlug).and.returnValue(EMPTY);
            mockedApiClient.getArticleComments.withArgs(mockedSlug).and.returnValue(EMPTY);
        }

        mockedRoute = jasmine.createSpyObj<ActivatedRoute>(ActivatedRoute.name, [], {
            params: mockedParams.asObservable(),
        });
        mockedRouter = jasmine.createSpyObj<Router>(Router.name, ['navigate']);
        mockedAuthStore = jasmine.createSpyObj<AuthStore>(AuthStore.name, [], {
            auth$: mockedAuth.asObservable(),
        });

        const { debugElement } = await render(`dummy`, {
            providers: [
                { provide: Router, useValue: mockedRouter },
                { provide: AuthStore, useValue: mockedAuthStore },
                { provide: ApiClient, useValue: mockedApiClient },
                { provide: ActivatedRoute, useValue: mockedRoute },
                provideComponentStore(ArticleStore),
            ],
        });

        store = debugElement.injector.get(ArticleStore);
    }

    describe('When init', () => {
        it('Then create store instance', async () => {
            await setup();
            expect(store).toBeTruthy();
        });

        it('Then have initial vm state', async () => {
            await setup();
            store.vm$.pipe(take(1)).subscribe((vm) => {
                expect(vm).toEqual({
                    article: null,
                    comments: [],
                    status: 'loading',
                    currentUser: mockedProfile,
                    isOwner: false,
                });
            });
        });

        describe('When get article success', () => {
            it('Then vm should have the article and article comments', async () => {
                await setup('success');
                store.vm$.pipe(take(1)).subscribe((vm) => {
                    expect(vm).toEqual({
                        article: mockedArticle,
                        comments: mockedComments,
                        isOwner: mockedArticle.author.username === mockedProfile.username,
                        currentUser: mockedProfile,
                        status: 'success',
                    });
                });
            });
        });

        describe('When get article failure', () => {
            it('Then vm should have status error', async () => {
                await setup('failure');
                store.vm$.pipe(take(1)).subscribe((vm) => {
                    expect(vm).toEqual({
                        article: null,
                        isOwner: false,
                        currentUser: mockedProfile,
                        status: 'error',
                        comments: [],
                    });
                });
            });
        });
    });

    describe('When toggleFavorite', () => {
        function arrangeToggleFavorite() {
            mockedApiClient.createArticleFavorite
                .withArgs(mockedSlug)
                .and.returnValue(of({ article: getMockedArticle({ article: { favorited: true } }) }));
            mockedApiClient.deleteArticleFavorite
                .withArgs(mockedSlug)
                .and.returnValue(of({ article: getMockedArticle({ article: { favorited: false } }) }));
        }

        describe('When article has already been favorited', () => {
            it('Then article is no longer favorited', async () => {
                await setup('success');
                arrangeToggleFavorite();

                store.toggleFavorite(getMockedArticle({ article: { favorited: true } }));

                expect(mockedApiClient.deleteArticleFavorite).toHaveBeenCalled();
                expect(mockedApiClient.createArticleFavorite).not.toHaveBeenCalled();

                store.vm$.pipe(take(1)).subscribe((vm) => {
                    expect(vm).toEqual({
                        comments: mockedComments,
                        status: 'success',
                        isOwner: mockedArticle.author.username === mockedProfile.username,
                        currentUser: mockedProfile,
                        article: { ...mockedArticle, favorited: false },
                    });
                });
            });
        });

        describe('When article has NOT been favorited', () => {
            it('Then article is favorited', async () => {
                await setup('success');
                arrangeToggleFavorite();

                store.toggleFavorite(getMockedArticle({ article: { favorited: false } }));

                expect(mockedApiClient.deleteArticleFavorite).not.toHaveBeenCalled();
                expect(mockedApiClient.createArticleFavorite).toHaveBeenCalled();

                store.vm$.pipe(take(1)).subscribe((vm) => {
                    expect(vm).toEqual({
                        comments: mockedComments,
                        status: 'success',
                        isOwner: mockedArticle.author.username === mockedProfile.username,
                        currentUser: mockedProfile,
                        article: { ...mockedArticle, favorited: true },
                    });
                });
            });
        });
    });

    describe('When deleteArticle', () => {
        function arrangeDeleteArticle() {
            mockedApiClient.deleteArticle.withArgs(mockedSlug).and.returnValue(of(null) as unknown as Observable<void>);
        }

        it('Then navigate to home', async () => {
            await setup('success');
            arrangeDeleteArticle();

            store.deleteArticle(mockedArticle);

            expect(mockedApiClient.deleteArticle).toHaveBeenCalled();
            expect(mockedRouter.navigate).toHaveBeenCalledWith(['/']);
        });
    });

    describe('When toggleFollowAuthor', () => {
        function arrangeToggleFollowAuthor() {
            mockedApiClient.followUserByUsername
                .withArgs(mockedProfile.username)
                .and.returnValue(of({ profile: getMockedProfile({ following: true }) }));

            mockedApiClient.unfollowUserByUsername
                .withArgs(mockedProfile.username)
                .and.returnValue(of({ profile: getMockedProfile({ following: false }) }));
        }

        describe('When author has already been followed', () => {
            it('Then author is no longer followed', async () => {
                await setup('success');
                arrangeToggleFollowAuthor();

                store.toggleFollowAuthor(getMockedProfile({ following: true }));

                expect(mockedApiClient.unfollowUserByUsername).toHaveBeenCalled();
                expect(mockedApiClient.followUserByUsername).not.toHaveBeenCalled();

                store.vm$.pipe(take(1)).subscribe((vm) => {
                    expect(vm).toEqual({
                        comments: mockedComments,
                        status: 'success',
                        isOwner: mockedArticle.author.username === mockedProfile.username,
                        currentUser: mockedProfile,
                        article: {
                            ...mockedArticle,
                            author: { ...mockedProfile, following: false },
                        },
                    });
                });
            });
        });

        describe('When author has NOT been followed', () => {
            it('Then author is followed', async () => {
                await setup('success');
                arrangeToggleFollowAuthor();

                store.toggleFollowAuthor(getMockedProfile({ following: false }));

                expect(mockedApiClient.unfollowUserByUsername).not.toHaveBeenCalled();
                expect(mockedApiClient.followUserByUsername).toHaveBeenCalled();

                store.vm$.pipe(take(1)).subscribe((vm) => {
                    expect(vm).toEqual({
                        comments: mockedComments,
                        status: 'success',
                        isOwner: mockedArticle.author.username === mockedProfile.username,
                        currentUser: mockedProfile,
                        article: {
                            ...mockedArticle,
                            author: { ...mockedProfile, following: true },
                        },
                    });
                });
            });
        });
    });

    describe('When createComment', () => {
        const mockedComment = getMockedArticleComment(1);

        function arrangeCreateComment() {
            mockedApiClient.createArticleComment.and.returnValue(of({ comment: mockedComment }));
        }

        it('Then new comment is added to comments', async () => {
            await setup('success');
            arrangeCreateComment();

            store.createComment(mockedComment.body);

            expect(mockedApiClient.createArticleComment).toHaveBeenCalledWith(mockedArticle.slug, {
                comment: { body: mockedComment.body },
            });

            store.vm$.pipe(take(1)).subscribe((vm) => {
                expect(vm).toEqual({
                    article: mockedArticle,
                    status: 'success',
                    isOwner: mockedArticle.author.username === mockedProfile.username,
                    currentUser: mockedProfile,
                    comments: [
                        ...mockedComments,
                        {
                            ...mockedComment,
                            isOwner: mockedComment.author.username === mockedUser.username,
                        },
                    ],
                });
            });
        });
    });

    describe('When deleteComment', () => {
        function arrangeDeleteComment() {
            mockedApiClient.deleteArticleComment.and.returnValue(of(null) as unknown as Observable<void>);
        }

        it('Then deleted comment is removed from comments', async () => {
            await setup('success');
            arrangeDeleteComment();

            store.deleteComment(mockedComments[0]);

            expect(mockedApiClient.deleteArticleComment).toHaveBeenCalledWith(mockedArticle.slug, mockedComments[0].id);

            store.vm$.pipe(take(1)).subscribe((vm) => {
                expect(vm).toEqual({
                    article: mockedArticle,
                    status: 'success',
                    isOwner: mockedArticle.author.username === mockedProfile.username,
                    currentUser: mockedProfile,
                    comments: [mockedComments[1]],
                });
            });
        });
    });
});
