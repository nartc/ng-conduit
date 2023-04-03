import { ComponentStore } from '@ngrx/component-store';
import { ProfileApiClient, UserAndAuthenticationApiClient } from '../api';
import { LocalStorageService } from '../local-storage.service';
import { authInitFactory, getProfileFactory, refreshFactory } from './auth-init.factory';
import { authStoreFactory } from './auth-store.factory';
import { initialAuthState } from './auth.di';

/*
describe(getProfileFactory.name, () => {});
describe(refreshFactory.name, () => {});

These are technically private APIs in relate to Auth Init. But we can test them in isolation if needed
*/

describe(authInitFactory.name, () => {
    let mockedProfileApiClient: jasmine.SpyObj<ProfileApiClient>;
    let mockedUserAndAuthenticationApiClient: jasmine.SpyObj<UserAndAuthenticationApiClient>;
    let mockedLocalStorageService: jasmine.SpyObj<LocalStorageService>;

    const authStore = authStoreFactory(new ComponentStore(initialAuthState));

    function setup() {
        mockedProfileApiClient = jasmine.createSpyObj<ProfileApiClient>(ProfileApiClient.name, [
            'getProfileByUsername',
        ]);
        mockedUserAndAuthenticationApiClient = jasmine.createSpyObj<UserAndAuthenticationApiClient>(
            UserAndAuthenticationApiClient.name,
            ['getCurrentUser']
        );

        return authInitFactory(
            authStore,
            getProfileFactory(authStore, mockedProfileApiClient),
            refreshFactory(authStore, mockedLocalStorageService, mockedUserAndAuthenticationApiClient)
        );
    }
});
