import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { Profile as ApiProfile } from '../shared/data-access/api';
import { injectComponentStore } from '../shared/di/store';
import { Articles } from '../shared/ui/articles/articles.component';
import { ProfileStore } from './profile.store';
import { ArticlesToggle } from './ui/articles-toggle/articles-toggle.component';
import { UserInfo } from './ui/user-info/user-info.component';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-page" *ngIf="vm$ | async as vm">
      <app-user-info
        *ngIf="vm.profile"
        [profile]="vm.profile"
        [isOwner]="vm.isOwner"
        (toggleFollow)="toggleFollow(vm.profile)"
      ></app-user-info>

      <div class="container" *ngIf="vm.profile">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <app-articles-toggle
              [articlesType]="vm.articleType"
              (selectProfileArticles)="selectProfileArticles(vm.profile)"
              (selectFavoritedArticles)="selectFavoritedArticles(vm.profile)"
            ></app-articles-toggle>
            <app-articles
              [articles]="vm.articles"
              [status]="vm.articlesStatus"
            ></app-articles>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [provideComponentStore(ProfileStore)],
  imports: [UserInfo, ArticlesToggle, Articles, CommonModule],
})
export class Profile {
  private readonly store = injectComponentStore(ProfileStore);

  readonly vm$ = this.store.vm$;

  toggleFollow(profile: ApiProfile) {
    this.store.toggleFollow(profile);
  }

  selectProfileArticles(profile: ApiProfile) {
    this.store.getArticles({ author: profile.username, isFavorited: false });
  }

  selectFavoritedArticles(profile: ApiProfile) {
    this.store.getArticles({ author: profile.username, isFavorited: true });
  }
}
