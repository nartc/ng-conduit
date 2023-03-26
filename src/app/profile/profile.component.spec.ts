import { By } from '@angular/platform-browser';
import { render, screen } from '@testing-library/angular';
import { ReplaySubject } from 'rxjs';
import { getMockedProfile } from '../testing.spec';
import { Profile } from './profile.component';
import { ProfileStore, ProfileVm } from './profile.store';
import { UserInfo } from './ui/user-info/user-info.component';

function getMockedVm(vm: Partial<ProfileVm> = {}): ProfileVm {
    return {
        profile: null,
        status: 'idle',
        isOwner: false,
        ...vm,
    };
}

describe(Profile.name, () => {
    let mockedStore: jasmine.SpyObj<ProfileStore>;

    let mockedVm$: ReplaySubject<ProfileVm>;

    async function setup(vm: Partial<ProfileVm> = {}) {
        mockedVm$ = new ReplaySubject(1);
        mockedVm$.next(getMockedVm(vm));

        mockedStore = jasmine.createSpyObj<ProfileStore>(ProfileStore.name, ['toggleFollow'], {
            vm$: mockedVm$.asObservable(),
        });

        return await render(Profile, {
            componentProviders: [{ provide: ProfileStore, useValue: mockedStore }],
        });
    }

    it('Then create component', async () => {
        const { fixture } = await setup();
        expect(fixture.componentInstance).toBeTruthy();
    });

    describe('When render', () => {
        describe('Given status is loading', () => {
            it('Then show loading profile text', async () => {
                await setup({ status: 'loading' });
                expect(screen.getByText(/Loading profile/)).toBeTruthy();
            });
        });

        describe('Given status is not loading', () => {
            describe('Given profile is null', () => {
                it('Then show nothing', async () => {
                    const { debugElement } = await setup({ status: 'success' });
                    expect(debugElement.query(By.directive(UserInfo))).toBeFalsy();
                });
            });

            describe('Given profile exists', () => {
                const mockedProfile = getMockedProfile();

                it('Then show UserInfo', async () => {
                    const { debugElement } = await setup({
                        status: 'success',
                        profile: mockedProfile,
                    });

                    const userInfo = debugElement.query(By.directive(UserInfo));
                });
            });
        });
    });
});
