import { inject, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore, INITIAL_STATE_TOKEN } from '@ngrx/component-store';
import { ProfileApiClient, UserAndAuthenticationApiClient } from '../api';
import { LocalStorageService } from '../local-storage.service';
import { AuthAuthenticateApi, authAuthenticateFactory } from './auth-authenticate.factory';
import { AuthInitApi, authInitFactory, getProfileFactory, refreshFactory } from './auth-init.factory';
import { AuthState, AuthStoreApi, authStoreFactory } from './auth-store.factory';

export const initialAuthState: AuthState = {
    user: null,
    profile: null,
    status: 'idle',
};

export function provideAuthComponentStore(initialState = initialAuthState) {
    return makeEnvironmentProviders([ComponentStore, { provide: INITIAL_STATE_TOKEN, useValue: initialState }]);
}

export const AUTH_STORE = new InjectionToken<AuthStoreApi>('AuthStore', {
    factory: () => authStoreFactory(inject(ComponentStore<AuthState>)),
});

export const AUTH_INIT = new InjectionToken<AuthInitApi>('Auth Init', {
    factory: () => {
        const authStore = inject(AUTH_STORE);
        const localStorageService = inject(LocalStorageService);
        const userAndAuthenticationApiClient = inject(UserAndAuthenticationApiClient);
        const profileApiClient = inject(ProfileApiClient);

        return authInitFactory(
            authStore,
            getProfileFactory(authStore, profileApiClient),
            refreshFactory(authStore, localStorageService, userAndAuthenticationApiClient)
        );
    },
});

export const AUTH_AUTHENTICATE = new InjectionToken<AuthAuthenticateApi>('Auth Authenticate', {
    factory: () => {
        const authStore = inject(AUTH_STORE);
        const localStorageService = inject(LocalStorageService);
        const userAndAuthenticationApiClient = inject(UserAndAuthenticationApiClient);
        const router = inject(Router);

        return authAuthenticateFactory(
            refreshFactory(authStore, localStorageService, userAndAuthenticationApiClient),
            router
        );
    },
});
