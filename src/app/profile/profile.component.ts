import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { Profile as ApiProfile } from '../shared/data-access/api';
import { ProfileStore } from './profile.store';
import { ArticlesToggle } from './ui/articles-toggle/articles-toggle.component';
import { UserInfo } from './ui/user-info/user-info.component';

@Component({
  template: `
    <div class="profile-page" *ngIf="vm$ | async as vm">
      <ng-container *ngIf="vm.status !== 'loading'; else loading">
        <ng-container *ngIf="vm.profile">
          <app-user-info
            [profile]="vm.profile"
            [isOwner]="vm.isOwner"
            (toggleFollow)="toggleFollow(vm.profile)"
          />
          <div class="container">
            <div class="row">
              <div class="col-xs-12 col-md-10 offset-md-1">
                <app-articles-toggle [username]="vm.profile.username" />
                <router-outlet />
              </div>
            </div>
          </div>
        </ng-container>
      </ng-container>
      <ng-template #loading>
        <p>Loading profile...</p>
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [provideComponentStore(ProfileStore)],
  imports: [UserInfo, ArticlesToggle, NgIf, AsyncPipe, RouterOutlet],
})
export default class Profile {
  private readonly store = inject(ProfileStore);

  readonly vm$ = this.store.vm$;

  toggleFollow(profile: ApiProfile) {
    this.store.toggleFollow(profile);
  }
}
