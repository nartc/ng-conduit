import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import {
  defer,
  exhaustMap,
  filter,
  MonoTypeOperatorFunction,
  Observable,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import {
  Anonymous3,
  Anonymous7,
  ApiClient,
  Article,
} from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { ApiStatus } from '../shared/data-access/models';

export interface HomeState {
  articles: Article[];
  tags: Anonymous7['tags'];
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
export class HomeStore
  extends ComponentStore<HomeState>
  implements OnStateInit, OnStoreInit
{
  private readonly apiClient = inject(ApiClient);
  private readonly authStore = inject(AuthStore);

  private readonly statuses$ = this.select((s) => s.statuses);

  private readonly articlesStatus$ = this.select(
    this.statuses$,
    (statuses) => statuses['articles']
  );
  private readonly tagsStatus$ = this.select(
    this.statuses$,
    (statuses) => statuses['tags']
  );

  readonly vm$: Observable<HomeVm> = this.select(
    this.authStore.isAuthenticated$,
    this.select((s) => s.articles),
    this.select((s) => s.tags),
    this.select((s) => s.selectedTag),
    this.select((s) => s.feedType),
    this.articlesStatus$.pipe(filter((status) => status !== 'idle')),
    this.tagsStatus$.pipe(filter((status) => status !== 'idle')),
    (
      isAuthenticated,
      articles,
      tags,
      selectedTag,
      feedType,
      articlesStatus,
      tagsStatus
    ) => ({
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
        this.apiClient.getTags().pipe(
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
        this.apiClient
          .getArticles(selectedTag)
          .pipe(this.getArticlesPostProcessing())
      )
    )
  );

  readonly getArticles = this.effect<void>(
    pipe(
      this.getArticlesPreProcessing('global'),
      switchMap(() =>
        this.apiClient.getArticles().pipe(this.getArticlesPostProcessing())
      )
    )
  );

  readonly getFeedArticles = this.effect<void>(
    pipe(
      this.getArticlesPreProcessing('feed'),
      switchMap(() =>
        this.apiClient.getArticlesFeed().pipe(this.getArticlesPostProcessing())
      )
    )
  );

  readonly toggleFavorite = this.effect<Article>(
    exhaustMap((article) =>
      defer(() => {
        if (article.favorited)
          return this.apiClient.deleteArticleFavorite(article.slug);
        return this.apiClient.createArticleFavorite(article.slug);
      }).pipe(
        tapResponse(
          (response) => {
            this.patchState((state) => ({
              articles: state.articles.map((article) => {
                if (article.slug === response.article.slug)
                  return response.article;
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

  private getArticlesPostProcessing(): MonoTypeOperatorFunction<Anonymous3> {
    return tapResponse<Anonymous3, unknown>(
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
