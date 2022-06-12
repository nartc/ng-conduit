import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import {
  ArticleForm,
  ArticleFormData,
} from '../../shared/ui/article-form/article-form.component';
import { EditorLayout } from '../../shared/ui/editor-layout/editor-layout.component';
import { EditArticleStore } from './edit-article.store';

@Component({
  selector: 'app-edit-article',
  template: `
    <app-editor-layout>
      <app-article-form
        *ngIf="article$ | async as article"
        [article]="article"
        (articleSubmit)="articleSubmit($event)"
      ></app-article-form>
    </app-editor-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EditorLayout, ArticleForm, CommonModule],
  providers: [provideComponentStore(EditArticleStore)],
})
export class EditArticle {
  constructor(private store: EditArticleStore) {}

  readonly article$ = this.store.article$;

  articleSubmit(article: ArticleFormData) {
    this.store.updateArticle(article);
  }
}
