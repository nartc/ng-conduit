import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { injectComponentStore } from '../../shared/di/store';
import { Articles } from '../../shared/ui/articles/articles.component';
import { MyArticlesStore } from './my-articles.store';

@Component({
  selector: 'app-my-articles',
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
  providers: [provideComponentStore(MyArticlesStore)],
})
export class MyArticles {
  private readonly store = injectComponentStore(MyArticlesStore);

  readonly vm$ = this.store.vm$;
}
