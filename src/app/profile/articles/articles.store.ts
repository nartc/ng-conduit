import { Inject, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { defer, exhaustMap } from 'rxjs';
import { ApiClient, Article } from '../../shared/data-access/api';
import { ProfileArticlesType, ProfileStore } from '../profile.store';
import { PROFILE_ARTICLES_TYPE } from './articles.di';

@Injectable()
export class ArticlesStore extends ComponentStore<{}> {
  readonly vm$ = this.profileStore.articlesVm$;

  constructor(
    @Inject(PROFILE_ARTICLES_TYPE) private type: ProfileArticlesType,
    private profileStore: ProfileStore,
    private apiClient: ApiClient
  ) {
    super({});
  }

  ngrxOnStateInit() {
    this.profileStore.getArticles(this.type);
  }

  readonly toggleFavorite = this.effect<Article>(
    exhaustMap((article) =>
      defer(() => {
        if (article.favorited)
          return this.apiClient.deleteArticleFavorite(article.slug);
        return this.apiClient.createArticleFavorite(article.slug);
      }).pipe(
        tapResponse(
          (response) => {
            this.profileStore.updateArticle(response.article);
          },
          (error) => {
            console.error('error toggling favorite: ', error);
          }
        )
      )
    )
  );
}
