import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap } from 'rxjs';
import { ApiClient, NewArticle } from '../shared/data-access/api';

@Injectable()
export class NewArticleStore extends ComponentStore<{}> {
  private readonly apiClient = inject(ApiClient);
  private readonly router = inject(Router);

  constructor() {
    super({});
  }

  readonly createArticle = this.effect<NewArticle>(
    exhaustMap((article) =>
      this.apiClient.createArticle({ article }).pipe(
        tapResponse(
          (response) => {
            void this.router.navigate(['/article', response.article.slug]);
          },
          (error) => {
            console.error('error creating article: ', error);
          }
        )
      )
    )
  );
}
