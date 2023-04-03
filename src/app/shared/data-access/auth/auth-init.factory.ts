import { tapResponse } from '@ngrx/component-store';
import { defer, of, switchMap } from 'rxjs';
import { ProfileApiClient, UserAndAuthenticationApiClient } from '../api';
import { LocalStorageService } from '../local-storage.service';
import { AuthStoreApi } from './auth-store.factory';

export function getProfileFactory(authStore: AuthStoreApi, profileApiClient: ProfileApiClient) {
    return authStore.effect<string>(
        switchMap((username) =>
            profileApiClient.getProfileByUsername({ username }).pipe(
                tapResponse(
                    (response) => {
                        authStore.updateProfile(response.profile);
                    },
                    (error) => {
                        console.error('error getting profile: ', error);
                    }
                )
            )
        )
    );
}

export function refreshFactory(
    authStore: AuthStoreApi,
    localStorageService: LocalStorageService,
    userAndAuthenticationApiClient: UserAndAuthenticationApiClient
) {
    return authStore.effect<void>(
        switchMap(() =>
            defer(() => {
                const token = localStorageService.getItem('ng-conduit-token');
                if (!token) return of(null);
                return userAndAuthenticationApiClient.getCurrentUser();
            }).pipe(
                tapResponse(
                    (response) => {
                        authStore.updateCurrentUser(response?.user || null);
                        localStorageService.setItem('ng-conduit-user', response?.user);
                    },
                    (error) => {
                        console.error('error refreshing current user: ', error);
                        authStore.updateCurrentUser(null);
                    }
                )
            )
        )
    );
}

export function authInitFactory(
    authStore: AuthStoreApi,
    getProfile: ReturnType<typeof getProfileFactory>,
    refresh: ReturnType<typeof refreshFactory>
) {
    return () => {
        refresh();
        getProfile(authStore.username$);
    };
}

export type AuthInitApi = ReturnType<typeof authInitFactory>;
