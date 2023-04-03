import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStateInit, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { defer, exhaustMap, filter, MonoTypeOperatorFunction, Observable, pipe, switchMap, tap } from 'rxjs';
import { Article, ArticlesApiClient, FavoritesApiClient, TagsApiClient } from '../shared/data-access/api';
import { AUTH_STORE } from '../shared/data-access/auth/auth.di';
import { ApiStatus } from '../shared/data-access/models';

export interface HomeState {
    articles: Article[];
    tags: Array<string>;
    selectedTag: string;
    feedType: 'global' | 'feed';
    statuses: Record<string, ApiStatus>;
}

export const initialHomeState: HomeState = {
    articles: [],
    tags: [],
    selectedTag: '',
    feedType: 'global',
    statuses: {
        articles: 'idle',
        tags: 'idle',
    },
};

export type HomeVm = Omit<HomeState, 'statuses'> & {
    isAuthenticated: boolean;
    articlesStatus: ApiStatus;
    tagsStatus: ApiStatus;
};

@Injectable()
export class HomeStore extends ComponentStore<HomeState> implements OnStateInit, OnStoreInit {
    private readonly tagsClient = inject(TagsApiClient);
    private readonly articlesClient = inject(ArticlesApiClient);
    private readonly favoritesClient = inject(FavoritesApiClient);

    private readonly authStore = inject(AUTH_STORE);

    private readonly statuses$ = this.select((s) => s.statuses);

    private readonly articlesStatus$ = this.select(this.statuses$, (statuses) => statuses['articles']);
    private readonly tagsStatus$ = this.select(this.statuses$, (statuses) => statuses['tags']);

    readonly vm$: Observable<HomeVm> = this.select(
        this.authStore.isAuthenticated$,
        this.select((s) => s.articles),
        this.select((s) => s.tags),
        this.select((s) => s.selectedTag),
        this.select((s) => s.feedType),
        this.articlesStatus$.pipe(filter((status) => status !== 'idle')),
        this.tagsStatus$.pipe(filter((status) => status !== 'idle')),
        (isAuthenticated, articles, tags, selectedTag, feedType, articlesStatus, tagsStatus) => ({
            isAuthenticated,
            articles,
            tags,
            selectedTag,
            feedType,
            articlesStatus,
            tagsStatus,
        }),
        { debounce: true }
    );

    ngrxOnStoreInit() {
        this.setState(initialHomeState);
    }

    ngrxOnStateInit() {
        this.getArticles();
        this.getTags();
    }

    private readonly getTags = this.effect<void>(
        pipe(
            tap(() => this.setStatus({ key: 'tags', status: 'loading' })),
            switchMap(() =>
                this.tagsClient.getTags().pipe(
                    tapResponse(
                        (response) => {
                            this.patchState({ tags: response.tags });
                            this.setStatus({ key: 'tags', status: 'success' });
                        },
                        (error) => {
                            console.error('error getting tags: ', error);
                            this.setStatus({ key: 'tags', status: 'error' });
                        }
                    )
                )
            )
        )
    );

    readonly getArticlesByTag = this.effect<string>(
        pipe(
            tap((selectedTag) => {
                this.setStatus({ key: 'articles', status: 'loading' });
                this.patchState({ selectedTag });
            }),
            switchMap((selectedTag) =>
                this.articlesClient.getArticles({ tag: selectedTag }).pipe(this.getArticlesPostProcessing())
            )
        )
    );

    readonly getArticles = this.effect<void>(
        pipe(
            this.getArticlesPreProcessing('global'),
            switchMap(() => this.articlesClient.getArticles().pipe(this.getArticlesPostProcessing()))
        )
    );

    readonly getFeedArticles = this.effect<void>(
        pipe(
            this.getArticlesPreProcessing('feed'),
            switchMap(() => this.articlesClient.getArticlesFeed().pipe(this.getArticlesPostProcessing()))
        )
    );

    readonly toggleFavorite = this.effect<Article>(
        exhaustMap(({ favorited, slug }) =>
            defer(() => {
                if (favorited) return this.favoritesClient.deleteArticleFavorite({ slug });
                return this.favoritesClient.createArticleFavorite({ slug });
            }).pipe(
                tapResponse(
                    (response) => {
                        this.patchState((state) => ({
                            articles: state.articles.map((article) => {
                                if (article.slug === response.article.slug) return response.article;
                                return article;
                            }),
                        }));
                    },
                    (error) => {
                        console.error('error toggling favorite: ', error);
                    }
                )
            )
        )
    );

    private getArticlesPreProcessing(feedType: 'global' | 'feed') {
        return tap<void>(() => {
            this.setStatus({ key: 'articles', status: 'loading' });
            this.patchState({ selectedTag: '', feedType });
        });
    }

    private getArticlesPostProcessing(): MonoTypeOperatorFunction<{
        articles: Article[];
    }> {
        return tapResponse<{ articles: Article[] }, unknown>(
            (response) => {
                this.patchState({ articles: response.articles });
                this.setStatus({ key: 'articles', status: 'success' });
            },
            (error) => {
                console.error('error getting articles: ', error);
                this.setStatus({ key: 'articles', status: 'error' });
            }
        );
    }

    private readonly setStatus = this.updater<{
        key: string;
        status: ApiStatus;
    }>((state, { key, status }) => ({
        ...state,
        statuses: { ...state.statuses, [key]: status },
    }));
}
