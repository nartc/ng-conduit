import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { defer, filter, Observable, of, switchMap, tap } from 'rxjs';
import { ApiClient, User } from './api';
import { LocalStorageService } from './local-storage.service';

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
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  readonly user$ = this.select((s) => s.user);
  readonly status$ = this.select((s) => s.status);

  readonly isAuthenticated$ = this.select(
    this.status$.pipe(filter((status) => status !== 'idle')),
    (status) => status === 'authenticated',
    { debounce: true }
  );

  readonly auth$: Observable<{ isAuthenticated: boolean; user: User | null }> =
    this.select(
      this.isAuthenticated$,
      this.user$,
      (isAuthenticated, user) => ({ user, isAuthenticated }),
      { debounce: true }
    );

  constructor() {
    super(initialAuthState);
  }

  readonly refresh = this.effect<void>(
    switchMap(() =>
      defer(() => {
        const token = this.localStorageService.getItem('ng-conduit-token');
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
            this.localStorageService.setItem('ng-conduit-user', response?.user);
          },
          (error) => {
            console.error('error refreshing current user: ', error);
            this.patchState({ user: null, status: 'unauthenticated' });
          }
        )
      )
    )
  );

  readonly logout = this.effect<void>(
    tap(() => {
      this.localStorageService.removeItem('ng-conduit-token');
      this.localStorageService.removeItem('ng-conduit-user');
      this.refresh();
      void this.router.navigate(['/']);
    })
  );
}
