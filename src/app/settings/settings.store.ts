import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { exhaustMap } from 'rxjs';
import { ApiClient, UpdateUser } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';

@Injectable()
export class SettingsStore extends ComponentStore<{}> implements OnStoreInit {
  private readonly authStore = inject(AuthStore);
  private readonly apiClient = inject(ApiClient);

  readonly vm$ = this.select(this.authStore.auth$, (auth) => auth.user, {
    debounce: true,
  });

  ngrxOnStoreInit() {
    this.setState({});
  }

  readonly updateSettings = this.effect<UpdateUser>(
    exhaustMap((user) =>
      this.apiClient.updateCurrentUser({ user }).pipe(
        tapResponse(
          () => {
            this.authStore.authenticate(['/profile', user.username as string]);
          },
          (error) => {
            console.error('error updating settings: ', error);
          }
        )
      )
    )
  );

  readonly logout = this.authStore.logout;
}
