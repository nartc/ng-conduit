import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import {
  defer,
  exhaustMap,
  filter,
  map,
  Observable,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { Profile, ProfileApiClient } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { ApiStatus } from '../shared/data-access/models';

export interface ProfileState {
  profile: Profile | null;
  status: ApiStatus;
}

export const initialProfileState: ProfileState = {
  profile: null,
  status: 'idle',
};

export type ProfileVm = ProfileState & {
  isOwner: boolean;
};

export type ProfileArticlesType = 'my' | 'favorites';

@Injectable()
export class ProfileStore
  extends ComponentStore<ProfileState>
  implements OnStateInit, OnStoreInit
{
  private readonly profileClient = inject(ProfileApiClient);
  private readonly route = inject(ActivatedRoute);
  private readonly authStore = inject(AuthStore);

  readonly profile$ = this.select((s) => s.profile);

  private readonly username$ = this.route.params.pipe(
    map((params) => params['username']),
    filter((username): username is string => username)
  );

  readonly vm$: Observable<ProfileVm> = this.select(
    this.authStore.auth$,
    this.profile$,
    this.select((s) => s.status).pipe(filter((status) => status !== 'idle')),
    (auth, profile, status) => ({
      profile,
      status,
      isOwner: auth.user?.username === profile?.username,
    }),
    { debounce: true }
  );

  ngrxOnStoreInit() {
    this.setState(initialProfileState);
  }

  ngrxOnStateInit() {
    this.getProfile(this.username$);
  }

  private readonly getProfile = this.effect<string>(
    pipe(
      tap(() => this.patchState({ status: 'loading' })),
      switchMap((username) =>
        this.profileClient.getProfileByUsername({ username }).pipe(
          tapResponse(
            (response) => {
              this.patchState({ profile: response.profile, status: 'success' });
            },
            (error) => {
              console.error('error getting profile by username: ', error);
              this.patchState({ profile: null, status: 'error' });
            }
          )
        )
      )
    )
  );

  readonly toggleFollow = this.effect<Profile>(
    exhaustMap(({ following, username }) =>
      defer(() => {
        if (following)
          return this.profileClient.unfollowUserByUsername({ username });
        return this.profileClient.followUserByUsername({ username });
      }).pipe(
        tapResponse(
          (response) => {
            this.patchState({ profile: response.profile });
          },
          (error) => {
            console.error('error toggling follow: ', error);
          }
        )
      )
    )
  );
}
