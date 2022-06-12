import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { Profile as ApiProfile } from '../shared/data-access/api';
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
              [username]="vm.profile.username"
            ></app-articles-toggle>
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [provideComponentStore(ProfileStore)],
  imports: [UserInfo, ArticlesToggle, CommonModule, RouterModule],
})
export class Profile {
  constructor(private store: ProfileStore) {}

  readonly vm$ = this.store.profileVm$;

  toggleFollow(profile: ApiProfile) {
    this.store.toggleFollow(profile);
  }
}
