import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { Article } from '../../shared/data-access/api';
import { ArticlesList } from '../../shared/ui/articles-list/articles-list.component';
import { ArticlesStore } from './articles.store';

@Component({
  template: `
    <app-articles-list
      *ngIf="vm$ | async as vm"
      [status]="vm.status"
      [articles]="vm.articles"
      (toggleFavorite)="toggleFavorite($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ArticlesList, NgIf, AsyncPipe],
  providers: [provideComponentStore(ArticlesStore)],
})
export default class Articles {
  private readonly store = inject(ArticlesStore);

  readonly vm$ = this.store.vm$;

  toggleFavorite(article: Article) {
    this.store.toggleFavorite(article);
  }
}
