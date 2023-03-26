import { provideComponentStore } from '@ngrx/component-store';
import { render } from '@testing-library/angular';
import { of, take } from 'rxjs';
import { ApiClient } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { getMockedProfile, getMockedUser } from '../testing.spec';
import { SettingsStore } from './settings.store';

describe(SettingsStore.name, () => {
    let store: SettingsStore;

    let mockedAuthStore: jasmine.SpyObj<AuthStore>;
    let mockedApiClient: jasmine.SpyObj<ApiClient>;

    const mockedUser = getMockedUser();
    const mockedProfile = getMockedProfile();

    async function setup() {
        mockedAuthStore = jasmine.createSpyObj<AuthStore>(AuthStore.name, ['authenticate', 'logout'], {
            auth$: of({
                isAuthenticated: true,
                user: mockedUser,
                profile: mockedProfile,
            }),
        });

        mockedApiClient = jasmine.createSpyObj<ApiClient>(ApiClient.name, ['updateCurrentUser']);

        const { debugElement } = await render('', {
            providers: [
                { provide: ApiClient, useValue: mockedApiClient },
                { provide: AuthStore, useValue: mockedAuthStore },
                provideComponentStore(SettingsStore),
            ],
        });

        store = debugElement.injector.get(SettingsStore);
    }

    describe('When init', () => {
        it('Then create store', async () => {
            await setup();
            expect(store).toBeTruthy();
            expect(store.logout).toBe(mockedAuthStore.logout);
        });

        it('Then vm has current user', async () => {
            await setup();

            store.vm$.pipe(take(1)).subscribe((vm) => {
                expect(vm).toEqual(mockedUser);
            });
        });
    });

    describe('When updateSettings', () => {
        it('Then call apiClient.updateCurrentUser', async () => {
            await setup();

            mockedApiClient.updateCurrentUser.and.returnValue(of({ user: getMockedUser({ username: 'updated' }) }));

            store.updateSettings({ username: 'updated' });
            expect(mockedApiClient.updateCurrentUser).toHaveBeenCalledWith({
                user: { username: 'updated' },
            });
            expect(mockedAuthStore.authenticate).toHaveBeenCalledWith(['/profile', 'updated']);
        });
    });
});
