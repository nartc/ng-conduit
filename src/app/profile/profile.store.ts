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
} from 'rxjs';
import { ApiClient, Article, Profile } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { ApiStatus } from '../shared/data-access/models';
import { injectComponentStore } from '../shared/di/store';

export interface ProfileState {
  profile: Profile | null;
  articles: Article[];
  articleType: 'profile' | 'favorited';
  statuses: Record<string, ApiStatus>;
}

export const initialProfileState: ProfileState = {
  profile: null,
  articles: [],
  articleType: 'profile',
  statuses: {
    articles: 'idle',
    profile: 'idle',
  },
};

export type ProfileVm = Omit<ProfileState, 'statuses'> & {
  profileStatus: ApiStatus;
  articlesStatus: ApiStatus;
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
  readonly articleType$ = this.select((s) => s.articleType);

  readonly profileStatus$ = this.select(
    this.statuses$,
    (statuses) => statuses['profile']
  );

  readonly articlesStatus$ = this.select(
    this.statuses$,
    (statuses) => statuses['articles']
  );

  readonly vm$: Observable<ProfileVm> = this.select(
    this.authStore.auth$,
    this.profile$,
    this.articles$,
    this.articleType$,
    this.profileStatus$.pipe(filter((status) => status !== 'idle')),
    this.articlesStatus$.pipe(filter((status) => status !== 'idle')),
    (auth, profile, articles, articleType, profileStatus, articlesStatus) => ({
      profile,
      articles,
      articleType,
      profileStatus,
      articlesStatus,
      isOwner: auth.user?.username === profile?.username,
    }),
    { debounce: true }
  );

  constructor() {
    super(initialProfileState);
  }

  ngrxOnStateInit() {
    this.getProfile(this.username$);
    this.getArticles({
      author: this.route.snapshot.params['username'],
      isFavorited: false,
    });
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

  readonly getArticles = this.effect<{
    author: string;
    isFavorited: boolean;
  }>(
    pipe(
      tap(({ isFavorited }) => {
        this.setStatus({ key: 'articles', status: 'loading' });
        this.patchState({ articleType: isFavorited ? 'favorited' : 'profile' });
      }),
      switchMap(({ author, isFavorited }) =>
        defer(() => {
          if (isFavorited)
            return this.apiClient.getArticles(undefined, undefined, author);
          return this.apiClient.getArticles(undefined, author);
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
