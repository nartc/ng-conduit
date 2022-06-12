import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import {
  ArticleForm,
  ArticleFormData,
} from '../shared/ui/article-form/article-form.component';
import { EditorLayout } from '../shared/ui/editor-layout/editor-layout.component';
import { NewArticleStore } from './new-article.store';

@Component({
  selector: 'app-new-article',
  template: `
    <app-editor-layout>
      <app-article-form
        (articleSubmit)="articleSubmit($event)"
      ></app-article-form>
    </app-editor-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EditorLayout, ArticleForm],
  providers: [provideComponentStore(NewArticleStore)],
})
export class NewArticle {
  constructor(private store: NewArticleStore) {}

  articleSubmit({ title, tagList, description, body }: ArticleFormData) {
    this.store.createArticle({ title, body, description, tagList });
  }
}
