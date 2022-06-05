import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap } from 'rxjs';
import { ApiClient, UpdateUser } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { injectComponentStore } from '../shared/di/store';

@Injectable()
export class SettingsStore extends ComponentStore<{}> {
  private readonly authStore = injectComponentStore(AuthStore);
  private readonly apiClient = inject(ApiClient);
  private readonly router = inject(Router);

  readonly vm$ = this.select(this.authStore.auth$, (auth) => auth.user, {
    debounce: true,
  });

  constructor() {
    super({});
  }

  readonly updateSettings = this.effect<UpdateUser>(
    exhaustMap((user) =>
      this.apiClient.updateCurrentUser({ user }).pipe(
        tapResponse(
          () => {
            this.authStore.refresh();
            void this.router.navigate(['/profile', user.username]);
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
