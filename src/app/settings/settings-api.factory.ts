import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, map } from 'rxjs';
import { UpdateUser, UserAndAuthenticationApiClient } from '../shared/data-access/api';
import { AuthAuthenticateApi } from '../shared/data-access/auth/auth-authenticate.factory';
import { AuthStoreApi } from '../shared/data-access/auth/auth-store.factory';
import { LocalStorageService } from '../shared/data-access/local-storage.service';

export function updateSettingsFactory(
    store: ComponentStore<{}>,
    authAuthenticate: AuthAuthenticateApi,
    userAndAuthenticationApiClient: UserAndAuthenticationApiClient
) {
    return store.effect<UpdateUser>(
        exhaustMap((user) =>
            userAndAuthenticationApiClient.updateCurrentUser({ body: { user } }).pipe(
                tapResponse(
                    () => {
                        authAuthenticate(['/profile', user.username as string]);
                    },
                    (error) => {
                        console.error('error updating settings: ', error);
                    }
                )
            )
        )
    );
}

export function settingsApiFactory(
    updateSettings: ReturnType<typeof updateSettingsFactory>,
    authAuthenticate: AuthAuthenticateApi,
    authStore: AuthStoreApi,
    localStorageService: LocalStorageService
) {
    return {
        user$: authStore.auth$.pipe(map((auth) => auth.user)),
        updateSettings,
        logout: () => {
            localStorageService.removeItem('ng-conduit-token');
            localStorageService.removeItem('ng-conduit-user');
            authAuthenticate();
        },
    };
}
