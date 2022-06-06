import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ComponentStore,
  OnStateInit,
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
  withLatestFrom,
} from 'rxjs';
import { ApiClient, Article, Profile } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { ApiStatus } from '../shared/data-access/models';
import { injectComponentStore } from '../shared/di/store';

export interface ProfileState {
  profile: Profile | null;
  articles: Article[];
  statuses: Record<string, ApiStatus>;
}

export const initialProfileState: ProfileState = {
  profile: null,
  articles: [],
  statuses: {
    articles: 'idle',
    profile: 'idle',
  },
};

export type ProfileVm = Omit<ProfileState, 'statuses' | 'articles'> & {
  profileStatus: ApiStatus;
  isOwner: boolean;
};

@Injectable()
export class ProfileStore
  extends ComponentStore<ProfileState>
  implements OnStateInit
{
  private readonly apiClient = inject(ApiClient);
  private readonly route = inject(ActivatedRoute);
  private readonly authStore = injectComponentStore(AuthStore);

  readonly username$ = this.route.params.pipe(
    map((params) => params['username']),
    filter((username): username is string => username)
  );

  readonly profile$ = this.select((s) => s.profile);
  readonly articles$ = this.select((s) => s.articles);
  readonly statuses$ = this.select((s) => s.statuses);

  readonly profileStatus$ = this.select(
    this.statuses$,
    (statuses) => statuses['profile']
  );

  readonly articlesStatus$ = this.select(
    this.statuses$,
    (statuses) => statuses['articles']
  );

  readonly articlesVm$: Observable<
    Pick<ProfileState, 'articles'> & { articlesStatus: ApiStatus }
  > = this.select(
    this.articles$,
    this.articlesStatus$.pipe(filter((status) => status !== 'idle')),
    (articles, articlesStatus) => ({ articles, articlesStatus })
  );

  readonly profileVm$: Observable<ProfileVm> = this.select(
    this.authStore.auth$,
    this.profile$,
    this.profileStatus$.pipe(filter((status) => status !== 'idle')),
    (auth, profile, profileStatus) => ({
      profile,
      profileStatus,
      isOwner: auth.user?.username === profile?.username,
    }),
    { debounce: true }
  );

  constructor() {
    super(initialProfileState);
  }

  ngrxOnStateInit() {
    this.getProfile(this.username$);
  }

  readonly getProfile = this.effect<string>(
    pipe(
      tap(() => this.setStatus({ key: 'profile', status: 'loading' })),
      switchMap((username) =>
        this.apiClient.getProfileByUsername(username).pipe(
          tapResponse(
            (response) => {
              this.patchState({ profile: response.profile });
              this.setStatus({ key: 'profile', status: 'success' });
            },
            (error) => {
              console.error('error getting profile by username: ', error);
              this.setStatus({ key: 'profile', status: 'error' });
            }
          )
        )
      )
    )
  );

  readonly getArticles = this.effect<'my' | 'favorites'>(
    pipe(
      withLatestFrom(this.profile$),
      tap(() => {
        this.setStatus({ key: 'articles', status: 'loading' });
      }),
      switchMap(([type, profile]) =>
        defer(() => {
          if (type === 'favorites')
            return this.apiClient.getArticles(
              undefined,
              undefined,
              profile?.username
            );
          return this.apiClient.getArticles(undefined, profile?.username);
        }).pipe(
          tapResponse(
            (response) => {
              this.patchState({ articles: response.articles });
              this.setStatus({ key: 'articles', status: 'success' });
            },
            (error) => {
              console.error('error getting articles: ', error);
              this.setStatus({ key: 'articles', status: 'error' });
            }
          )
        )
      )
    )
  );

  readonly toggleFollow = this.effect<Profile>(
    exhaustMap((profile) =>
      defer(() => {
        if (profile.following)
          return this.apiClient.unfollowUserByUsername(profile.username);
        return this.apiClient.followUserByUsername(profile.username);
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

  private readonly setStatus = this.updater<{
    key: string;
    status: ApiStatus;
  }>((state, { key, status }) => ({
    ...state,
    statuses: { ...state.statuses, [key]: status },
  }));
}
