import { ActivatedRoute, Params } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { render } from '@testing-library/angular';
import { EMPTY, of, ReplaySubject, take, throwError } from 'rxjs';
import { ApiClient } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { getMockedProfile, getMockedUser } from '../testing.spec';
import { ProfileStore } from './profile.store';

describe(ProfileStore.name, () => {
    let store: ProfileStore;

    let mockedApiClient: jasmine.SpyObj<ApiClient>;
    let mockedRoute: jasmine.SpyObj<ActivatedRoute>;
    let mockedAuthStore: jasmine.SpyObj<AuthStore>;

    let mockedParams$: ReplaySubject<Params>;

    const mockedUser = getMockedUser();
    const mockedProfile = getMockedProfile();

    async function setup(getProfileStatus: 'idle' | 'success' | 'error' = 'idle', username = mockedUser.username) {
        mockedParams$ = new ReplaySubject(1);
        mockedParams$.next({ username });

        mockedApiClient = jasmine.createSpyObj<ApiClient>(ApiClient.name, [
            'getProfileByUsername',
            'unfollowUserByUsername',
            'followUserByUsername',
        ]);

        if (getProfileStatus === 'success') {
            mockedApiClient.getProfileByUsername
                .withArgs(username)
                .and.returnValue(of({ profile: getMockedProfile({ username }) }));
        } else if (getProfileStatus === 'error') {
            mockedApiClient.getProfileByUsername.withArgs(username).and.returnValue(throwError(() => 'error'));
        } else {
            mockedApiClient.getProfileByUsername.withArgs(username).and.returnValue(EMPTY);
        }

        mockedRoute = jasmine.createSpyObj<ActivatedRoute>(ActivatedRoute.name, [], {
            params: mockedParams$.asObservable(),
        });
        mockedAuthStore = jasmine.createSpyObj<AuthStore>(AuthStore.name, [], {
            auth$: of({
                isAuthenticated: true,
                user: mockedUser,
                profile: mockedProfile,
            }),
        });

        const { debugElement } = await render('', {
            providers: [
                { provide: ApiClient, useValue: mockedApiClient },
                { provide: AuthStore, useValue: mockedAuthStore },
                { provide: ActivatedRoute, useValue: mockedRoute },
                provideComponentStore(ProfileStore),
            ],
        });

        store = debugElement.injector.get(ProfileStore);
    }

    describe('When init', () => {
        it('Then create store', async () => {
            await setup();
            expect(store).toBeTruthy();
        });

        it('Then store has initial state with loading status', async () => {
            await setup();
            store.vm$.pipe(take(1)).subscribe((vm) => {
                expect(vm).toEqual({
                    profile: null,
                    status: 'loading',
                    isOwner: false,
                });
            });
        });

        describe('Given getProfileByUsername is success', () => {
            it('Then vm has profile and success status', async () => {
                await setup('success');

                expect(mockedApiClient.getProfileByUsername).toHaveBeenCalledWith(mockedUser.username);

                store.vm$.pipe(take(1)).subscribe((vm) => {
                    expect(vm).toEqual({
                        isOwner: true,
                        profile: getMockedProfile({ username: mockedUser.username }),
                        status: 'success',
                    });
                });
            });
        });

        describe('Given getProfileByUsername is failure', () => {
            it('Then vm has null profile and error status', async () => {
                await setup('error');

                expect(mockedApiClient.getProfileByUsername).toHaveBeenCalledWith(mockedUser.username);

                store.vm$.pipe(take(1)).subscribe((vm) => {
                    expect(vm).toEqual({
                        isOwner: false,
                        profile: null,
                        status: 'error',
                    });
                });
            });
        });
    });

    describe('When toggleFollow', () => {
        describe('Given profile has already been followed', () => {
            it('Then call apiClient.unfollowUserByUsername', async () => {
                await setup('success');

                const originalProfile = getMockedProfile({ following: true });

                mockedApiClient.unfollowUserByUsername.and.returnValue(
                    of({ profile: getMockedProfile({ following: false }) })
                );

                store.toggleFollow(originalProfile);

                expect(mockedApiClient.unfollowUserByUsername).toHaveBeenCalledWith(originalProfile.username);
                expect(mockedApiClient.followUserByUsername).not.toHaveBeenCalled();

                store.vm$.pipe(take(1)).subscribe((vm) => {
                    expect(vm).toEqual({
                        isOwner: true,
                        profile: { ...originalProfile, following: false },
                        status: 'success',
                    });
                });
            });
        });

        describe('Given profile has not been followed', () => {
            it('Then call apiClient.followUserByUsername', async () => {
                await setup('success');

                const originalProfile = getMockedProfile({ following: false });

                mockedApiClient.followUserByUsername.and.returnValue(
                    of({ profile: getMockedProfile({ following: true }) })
                );

                store.toggleFollow(originalProfile);

                expect(mockedApiClient.followUserByUsername).toHaveBeenCalledWith(originalProfile.username);
                expect(mockedApiClient.unfollowUserByUsername).not.toHaveBeenCalled();

                store.vm$.pipe(take(1)).subscribe((vm) => {
                    expect(vm).toEqual({
                        isOwner: true,
                        profile: { ...originalProfile, following: true },
                        status: 'success',
                    });
                });
            });
        });
    });
});
