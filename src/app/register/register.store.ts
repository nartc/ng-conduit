import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap } from 'rxjs';
import { ApiClient, NewUser } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { LocalStorageService } from '../shared/data-access/local-storage.service';
import { injectComponentStore } from '../shared/di/store';
import { processAuthErrors } from '../shared/utils/process-auth-errors';

export interface RegisterState {
  errors: Record<string, string[]>;
}

export const initialRegisterState: RegisterState = {
  errors: {},
};

@Injectable()
export class RegisterStore extends ComponentStore<RegisterState> {
  private readonly apiClient = inject(ApiClient);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);
  private readonly authStore = injectComponentStore(AuthStore);

  readonly errors$ = this.select((s) => s.errors);

  readonly registerErrors$ = this.select(this.errors$, processAuthErrors);

  constructor() {
    super(initialRegisterState);
  }

  readonly register = this.effect<NewUser>(
    exhaustMap((newUser) => {
      return this.apiClient.createUser({ user: newUser }).pipe(
        tapResponse(
          (response) => {
            this.localStorageService.setItem(
              'ng-conduit-token',
              response.user.token
            );
            this.localStorageService.setItem('ng-conduit-user', response.user);
            this.authStore.refresh();
            void this.router.navigate(['/']);
          },
          (error: { errors: Record<string, string[]> }) => {
            console.error('error registering new user: ', error);
            if (error.errors) {
              this.patchState({ errors: error.errors });
            }
          }
        )
      );
    })
  );
}
