import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { exhaustMap, filter, pipe, switchMap, withLatestFrom } from 'rxjs';
import {
  Article,
  ArticlesApiClient,
  UpdateArticle,
} from '../../shared/data-access/api';

export interface EditArticleState {
  article: Article | null;
}

export const initialEditArticleState: EditArticleState = {
  article: null,
};

@Injectable()
export class EditArticleStore
  extends ComponentStore<EditArticleState>
  implements OnStateInit, OnStoreInit
{
  private readonly articlesClient = inject(ArticlesApiClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly slug$ = this.select(
    this.route.params,
    (params) => params['slug'] as string
  );

  readonly article$ = this.select((s) => s.article, { debounce: true });

  ngrxOnStoreInit() {
    this.setState(initialEditArticleState);
  }

  ngrxOnStateInit() {
    this.getArticleBySlug(this.slug$);
  }

  readonly getArticleBySlug = this.effect<string>(
    switchMap((slug) =>
      this.articlesClient.getArticle({ slug }).pipe(
        tapResponse(
          (response) => {
            this.patchState({ article: response.article });
          },
          (error) => {
            console.error('error getting article by slug: ', error);
          }
        )
      )
    )
  );

  readonly updateArticle = this.effect<UpdateArticle>(
    pipe(
      withLatestFrom(this.article$.pipe(filter(Boolean))),
      exhaustMap(([updatedArticle, article]) =>
        this.articlesClient
          .updateArticle({
            slug: article.slug,
            body: { article: updatedArticle },
          })
          .pipe(
            tapResponse(
              (response) => {
                void this.router.navigate(['/article', response.article.slug]);
              },
              (error) => {
                console.error('error updating article: ', error);
              }
            )
          )
      )
    )
  );
}
