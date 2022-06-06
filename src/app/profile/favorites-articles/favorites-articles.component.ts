import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { injectComponentStore } from '../../shared/di/store';
import { Articles } from '../../shared/ui/articles/articles.component';
import { FavoritesArticlesStore } from './favorites-articles.store';

@Component({
  selector: 'app-favorites-articles',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <app-articles
        [status]="vm.articlesStatus"
        [articles]="vm.articles"
      ></app-articles>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [Articles, CommonModule],
  providers: [provideComponentStore(FavoritesArticlesStore)],
})
export class FavoritesArticles {
  private readonly store = injectComponentStore(FavoritesArticlesStore);

  readonly vm$ = this.store.vm$;
}
