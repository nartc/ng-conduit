import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { Article } from '../shared/data-access/api';
import { ArticlesList } from '../shared/ui/articles-list/articles-list.component';
import { HomeStore } from './home.store';
import { Banner } from './ui/banner/banner.component';
import { FeedToggle } from './ui/feed-toggle/feed-toggle.component';
import { Tags } from './ui/tags/tags.component';

@Component({
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <div class="home-page">
        <app-banner />

        <div class="container page">
          <div class="row">
            <div class="col-md-9">
              <app-feed-toggle
                [selectedTag]="vm.selectedTag"
                [isFeedDisabled]="!vm.isAuthenticated"
                [feedType]="vm.feedType"
                (selectFeed)="selectFeed()"
                (selectGlobal)="selectGlobal()"
              />
              <app-articles-list
                [status]="vm.articlesStatus"
                [articles]="vm.articles"
                (toggleFavorite)="toggleFavorite($event)"
              />
            </div>

            <div class="col-md-3">
              <app-tags
                [status]="vm.tagsStatus"
                [tags]="vm.tags"
                (selectTag)="selectTag($event)"
              >
                <p>Loading...</p>
              </app-tags>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [Banner, Tags, FeedToggle, ArticlesList, NgIf, AsyncPipe],
  providers: [provideComponentStore(HomeStore)],
})
export default class Home {
  private readonly store = inject(HomeStore);

  readonly vm$ = this.store.vm$;

  selectTag(tag: string) {
    this.store.getArticlesByTag(tag);
  }

  selectFeed() {
    this.store.getFeedArticles();
  }

  selectGlobal() {
    this.store.getArticles();
  }

  toggleFavorite(article: Article) {
    this.store.toggleFavorite(article);
  }
}
