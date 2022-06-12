import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { Article } from '../../shared/data-access/api';
import { ArticlesList } from '../../shared/ui/articles-list/articles-list.component';
import { ArticlesStore } from './articles.store';

@Component({
  selector: 'app-articles',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <app-articles-list
        [status]="vm.articlesStatus"
        [articles]="vm.articles"
        (toggleFavorite)="toggleFavorite($event)"
      ></app-articles-list>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ArticlesList, CommonModule],
  providers: [provideComponentStore(ArticlesStore)],
})
export class Articles {
  constructor(private store: ArticlesStore) {}

  readonly vm$ = this.store.vm$;

  toggleFavorite(article: Article) {
    this.store.toggleFavorite(article);
  }
}
