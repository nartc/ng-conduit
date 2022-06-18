import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ComponentStore,
  OnStateInit,
  tapResponse,
} from '@ngrx/component-store';
import { exhaustMap, pipe, switchMap, withLatestFrom } from 'rxjs';
import {
  ApiClient,
  Article,
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
  implements OnStateInit
{
  readonly slug$ = this.select(
    this.route.params,
    (params) => params['slug'] as string
  );

  readonly article$ = this.select((s) => s.article, { debounce: true });

  constructor(
    private apiClient: ApiClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(initialEditArticleState);
  }

  ngrxOnStateInit() {
    this.getArticleBySlug(this.slug$);
  }

  readonly getArticleBySlug = this.effect<string>(
    switchMap((slug) =>
      this.apiClient.getArticle(slug).pipe(
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
      withLatestFrom(this.article$),
      exhaustMap(([updatedArticle, article]) =>
        this.apiClient
          .updateArticle(article!.slug, { article: updatedArticle })
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
