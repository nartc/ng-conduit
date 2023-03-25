import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import {
  ArticleForm,
  ArticleFormData,
} from '../../shared/ui/article-form/article-form.component';
import { EditorLayout } from '../../shared/ui/editor-layout/editor-layout.component';
import { EditArticleStore } from './edit-article.store';

@Component({
  template: `
    <app-editor-layout>
      <app-article-form
        *ngIf="article$ | async as article"
        [article]="article"
        (articleSubmit)="articleSubmit($event)"
      />
    </app-editor-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EditorLayout, ArticleForm, NgIf, AsyncPipe],
  providers: [provideComponentStore(EditArticleStore)],
})
export default class EditArticle {
  private readonly store = inject(EditArticleStore);

  readonly article$ = this.store.article$;

  articleSubmit(article: ArticleFormData) {
    this.store.updateArticle(article);
  }
}
