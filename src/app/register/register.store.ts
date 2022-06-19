import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap } from 'rxjs';
import { ApiClient, NewUser } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { LocalStorageService } from '../shared/data-access/local-storage.service';
import { processAuthErrors } from '../shared/utils/process-auth-errors';

export interface RegisterState {
  errors: Record<string, string[]>;
}

export const initialRegisterState: RegisterState = {
  errors: {},
};

@Injectable()
export class RegisterStore extends ComponentStore<RegisterState> {
  readonly errors$ = this.select((s) => s.errors);

  readonly registerErrors$ = this.select(this.errors$, processAuthErrors, {
    debounce: true,
  });

  constructor(
    private apiClient: ApiClient,
    private localStorageService: LocalStorageService,
    private authStore: AuthStore
  ) {
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
            this.authStore.authenticate();
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
