import { inject, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { defer, of, switchMap } from 'rxjs';
import { ApiClient, User } from './api';
import { LocalStore } from './local.store';

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: User | null;
  status: AuthStatus;
}

export const initialAuthState: AuthState = {
  user: null,
  status: 'idle',
};

@Injectable({ providedIn: 'root' })
export class AuthStore extends ComponentStore<AuthState> {
  private readonly apiClient = inject(ApiClient);
  private readonly localStore = inject(LocalStore);

  readonly user$ = this.select((s) => s.user);
  readonly status$ = this.select((s) => s.status);

  readonly isAuthenticated$ = this.select(
    this.status$,
    (status) => status === 'authenticated'
  );

  constructor() {
    super(initialAuthState);
  }

  readonly refresh = this.effect<void>(
    switchMap(() =>
      defer(() => {
        const token = this.localStore.getItem('ng-conduit-token');
        if (!token) {
          return of(null);
        }
        return this.apiClient.getCurrentUser();
      }).pipe(
        tapResponse(
          (response) => {
            this.patchState({
              user: response?.user || null,
              status: !!response ? 'authenticated' : 'unauthenticated',
            });
          },
          (error) => {
            console.error('error refreshing current user: ', error);
            this.patchState({ user: null, status: 'unauthenticated' });
          }
        )
      )
    )
  );
}
