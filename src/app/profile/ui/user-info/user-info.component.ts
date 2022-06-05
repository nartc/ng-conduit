import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Profile } from '../../../shared/data-access/api';

@Component({
  selector: 'app-user-info[profile]',
  template: `
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img
              [src]="profile.image"
              alt="Avatar of profile"
              class="user-img"
            />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button
              class="btn btn-sm btn-outline-secondary action-btn"
              (click)="toggleFollow.emit()"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ profile.following ? 'Unfollow' : 'Follow' }}
              {{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UserInfo {
  @Input() profile!: Profile;

  @Output() toggleFollow = new EventEmitter();
}
