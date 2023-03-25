import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { exhaustMap } from 'rxjs';
import { ApiClient, LoginUser } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { LocalStorageService } from '../shared/data-access/local-storage.service';
import { processAuthErrors } from '../shared/utils/process-auth-errors';

export interface LoginState {
  errors: Record<string, string[]>;
}

export const initialLoginState: LoginState = {
  errors: {},
};

@Injectable()
export class LoginStore
  extends ComponentStore<LoginState>
  implements OnStoreInit
{
  private readonly apiClient = inject(ApiClient);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly authStore = inject(AuthStore);

  readonly loginErrors$ = this.select(
    this.select((s) => s.errors),
    processAuthErrors,
    { debounce: true }
  );

  ngrxOnStoreInit() {
    this.setState(initialLoginState);
  }

  readonly login = this.effect<LoginUser>(
    exhaustMap((loginUser) =>
      this.apiClient.login({ user: loginUser }).pipe(
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
            console.error('error login user: ', error);
            if (error.errors) {
              this.patchState({ errors: error.errors });
            }
          }
        )
      )
    )
  );
}
