import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStateInit, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { defer, exhaustMap, filter, Observable, pipe, switchMap, tap, withLatestFrom } from 'rxjs';
import { Article, ArticlesApiClient, FavoritesApiClient } from '../../shared/data-access/api';
import { ApiStatus } from '../../shared/data-access/models';
import { ProfileArticlesType, ProfileStore } from '../profile.store';
import { PROFILE_ARTICLES_TYPE } from './articles.di';

export interface ArticlesState {
    articles: Article[];
    status: ApiStatus;
}

export const initialArticlesState: ArticlesState = {
    status: 'idle',
    articles: [],
};

@Injectable()
export class ArticlesStore extends ComponentStore<ArticlesState> implements OnStoreInit, OnStateInit {
    private readonly articlesClient = inject(ArticlesApiClient);
    private readonly favoritesClient = inject(FavoritesApiClient);

    private readonly type = inject(PROFILE_ARTICLES_TYPE);
    private readonly profileStore = inject(ProfileStore);

    readonly vm$: Observable<ArticlesState> = this.select(
        this.select((s) => s.articles),
        this.select((s) => s.status).pipe(filter((status) => status !== 'idle')),
        (articles, status) => ({ articles, status }),
        { debounce: true }
    );

    ngrxOnStoreInit() {
        this.setState(initialArticlesState);
    }

    ngrxOnStateInit() {
        this.getArticles(this.type);
    }

    readonly getArticles = this.effect<ProfileArticlesType>(
        pipe(
            withLatestFrom(this.profileStore.profile$),
            tap(() => this.patchState({ status: 'loading' })),
            switchMap(([type, profile]) =>
                defer(() => {
                    if (type === 'favorites')
                        return this.articlesClient.getArticles({
                            favorited: profile?.username,
                        });
                    return this.articlesClient.getArticles({ author: profile?.username });
                }).pipe(
                    tapResponse(
                        (response) => {
                            this.patchState({
                                articles: response.articles,
                                status: 'success',
                            });
                        },
                        (error) => {
                            console.error('error getting articles: ', error);
                            this.patchState({ articles: [], status: 'error' });
                        }
                    )
                )
            )
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
}
