import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentStore, OnStateInit, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { defer, exhaustMap, filter, forkJoin, Observable, pipe, switchMap, tap, withLatestFrom } from 'rxjs';
import {
    Article,
    ArticlesApiClient,
    Comment,
    CommentsApiClient,
    FavoritesApiClient,
    Profile,
    ProfileApiClient,
} from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { ApiStatus, CommentWithOwner } from '../shared/data-access/models';

export interface ArticleState {
    article: Article | null;
    comments: Comment[];
    status: ApiStatus;
}

export const initialArticleState: ArticleState = {
    comments: [],
    article: null,
    status: 'idle',
};

export type ArticleVm = Omit<ArticleState, 'comments'> & {
    isOwner: boolean;
    comments: CommentWithOwner[];
    currentUser: Profile;
};

@Injectable()
export class ArticleStore extends ComponentStore<ArticleState> implements OnStateInit, OnStoreInit {
    private readonly articlesClient = inject(ArticlesApiClient);
    private readonly commentsClient = inject(CommentsApiClient);
    private readonly favoritesClient = inject(FavoritesApiClient);
    private readonly profileClient = inject(ProfileApiClient);

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly authStore = inject(AuthStore);

    readonly slug$ = this.select(this.route.params, (params) => params['slug'] as string);

    readonly article$ = this.select((s) => s.article);
    readonly comments$ = this.select((s) => s.comments);
    readonly status$ = this.select((s) => s.status);

    readonly vm$: Observable<ArticleVm> = this.select(
        this.authStore.auth$,
        this.article$,
        this.comments$,
        this.status$.pipe(filter((status) => status !== 'idle')),
        (auth, article, comments, status) => {
            return {
                article,
                comments: comments.map((comment) => {
                    return {
                        ...comment,
                        isOwner: comment.author.username === auth.user?.username,
                    };
                }),
                status,
                currentUser: auth.profile!,
                isOwner: auth.user?.username === article?.author.username,
            };
        },
        { debounce: true }
    );

    ngrxOnStoreInit() {
        this.setState(initialArticleState);
    }

    ngrxOnStateInit() {
        this.getArticle(this.slug$);
    }

    private readonly getArticle = this.effect<string>(
        pipe(
            tap(() => this.patchState({ status: 'loading' })),
            switchMap((slug) =>
                forkJoin({
                    article: this.articlesClient.getArticle({ slug }),
                    comments: this.commentsClient.getArticleComments({ slug }),
                }).pipe(
                    tapResponse(
                        ({ article: { article }, comments: { comments } }) => {
                            this.patchState({ article, comments, status: 'success' });
                        },
                        (error) => {
                            console.error('error getting article/comments: ', error);
                            this.patchState({ status: 'error' });
                        }
                    )
                )
            )
        )
    );

    readonly toggleFavorite = this.effect<Article>(
        exhaustMap(({ slug, favorited }) =>
            defer(() => {
                if (favorited) return this.favoritesClient.deleteArticleFavorite({ slug });
                return this.favoritesClient.createArticleFavorite({ slug });
            }).pipe(
                tapResponse(
                    (response) => {
                        this.patchState({ article: response.article });
                    },
                    (error) => {
                        console.error('error toggling article favorite: ', error);
                    }
                )
            )
        )
    );

    readonly deleteArticle = this.effect<Article>(
        exhaustMap(({ slug }) =>
            this.articlesClient.deleteArticle({ slug }).pipe(
                tapResponse(
                    () => {
                        void this.router.navigate(['/']);
                    },
                    (error) => {
                        console.error('error deleting article: ', error);
                    }
                )
            )
        )
    );

    readonly toggleFollowAuthor = this.effect<Profile>(
        exhaustMap(({ following, username }) =>
            defer(() => {
                if (following) return this.profileClient.unfollowUserByUsername({ username });
                return this.profileClient.followUserByUsername({ username });
            }).pipe(
                tapResponse(
                    (response) => {
                        this.patchState((state) => ({
                            article: {
                                ...state.article!,
                                author: response.profile,
                            },
                        }));
                    },
                    (error) => {
                        console.error('error toggling following author: ', error);
                    }
                )
            )
        )
    );

    readonly createComment = this.effect<string>(
        pipe(
            withLatestFrom(this.article$.pipe(filter(Boolean))),
            exhaustMap(([comment, article]) =>
                this.commentsClient
                    .createArticleComment({
                        slug: article.slug,
                        body: { comment: { body: comment } },
                    })
                    .pipe(
                        tapResponse(
                            (response) => {
                                this.patchState((state) => ({
                                    comments: [...state.comments, response.comment],
                                }));
                            },
                            (error) => {
                                console.error('error creating new comment: ', error);
                            }
                        )
                    )
            )
        )
    );

    readonly deleteComment = this.effect<CommentWithOwner>(
        pipe(
            withLatestFrom(this.article$.pipe(filter(Boolean))),
            exhaustMap(([commentWithOwner, article]) =>
                this.commentsClient.deleteArticleComment({ slug: article.slug, id: commentWithOwner.id }).pipe(
                    tapResponse(
                        () => {
                            this.patchState((state) => ({
                                comments: state.comments.filter((comment) => comment.id !== commentWithOwner.id),
                            }));
                        },
                        (error) => {
                            console.error('error deleting comment: ', error);
                        }
                    )
                )
            )
        )
    );
}
