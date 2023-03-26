import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ReplaySubject } from 'rxjs';
import { User } from '../shared/data-access/api';
import { getMockedUser } from '../testing.spec';
import { Settings } from './settings.component';
import { SettingsStore } from './settings.store';

describe(Settings.name, () => {
    let mockedStore: jasmine.SpyObj<SettingsStore>;

    let mockedVm$: ReplaySubject<User>;

    const mockedUser = getMockedUser();

    async function setup() {
        mockedVm$ = new ReplaySubject(1);
        mockedVm$.next(mockedUser);

        mockedStore = jasmine.createSpyObj<SettingsStore>(SettingsStore.name, ['updateSettings', 'logout'], {
            vm$: mockedVm$.asObservable(),
        });

        return await render(Settings, {
            componentProviders: [{ provide: SettingsStore, useValue: mockedStore }],
        });
    }

    it('Then create component', async () => {
        const { fixture } = await setup();
        expect(fixture.componentInstance).toBeTruthy();
    });

    describe('When render', () => {
        it('Then show title', async () => {
            const { getByText } = await setup();
            const title = getByText(/Your Settings/);
            expect(title).toBeTruthy();
        });

        it('Then show logout button', async () => {
            const { getByText } = await setup();
            const logoutButton = getByText(/Or click here to logout/);
            expect(logoutButton).toBeTruthy();
            expect(logoutButton).toHaveClassName('btn-outline-danger');
        });

        it('Then show form controls with current user value', async () => {
            const { getByPlaceholderText } = await setup();

            const urlInput = getByPlaceholderText(/URL of profile picture/);
            const usernameInput = getByPlaceholderText(/Your Username/);
            const bioInput = getByPlaceholderText(/Short bio about you/);
            const emailInput = getByPlaceholderText(/Email/);
            const passwordInput = getByPlaceholderText(/Password/);

            expect(urlInput).toHaveValue(mockedUser.image);
            expect(usernameInput).toHaveValue(mockedUser.username);
            expect(bioInput).toHaveValue(mockedUser.bio);
            expect(emailInput).toHaveValue(mockedUser.email);
            expect(passwordInput).toHaveValue('');
        });
    });

    describe('Given invalid form', () => {
        it('Then update settings button is disabled', async () => {
            const { getByPlaceholderText, getByText } = await setup();

            const urlInput = getByPlaceholderText(/URL of profile picture/);
            const usernameInput = getByPlaceholderText(/Your Username/);
            const bioInput = getByPlaceholderText(/Short bio about you/);
            const emailInput = getByPlaceholderText(/Email/);
            const submitButton = getByText(/Update Settings/);

            await userEvent.clear(urlInput);
            await userEvent.clear(usernameInput);
            await userEvent.clear(bioInput);
            await userEvent.clear(emailInput);

            // empty username
            await userEvent.type(emailInput, 'mail@mail.com');
            expect(submitButton).toHaveAttribute('disabled');

            // empty email
            await userEvent.type(usernameInput, 'username');
            await userEvent.clear(emailInput);
            expect(submitButton).toHaveAttribute('disabled');

            // invalid email
            await userEvent.type(emailInput, 'mail');
            expect(submitButton).toHaveAttribute('disabled');
        });
    });

    describe('Given valid form', () => {
        it('Then update settings button is enabled', async () => {
            const { getByPlaceholderText, getByText } = await setup();

            const urlInput = getByPlaceholderText(/URL of profile picture/);
            const usernameInput = getByPlaceholderText(/Your Username/);
            const bioInput = getByPlaceholderText(/Short bio about you/);
            const emailInput = getByPlaceholderText(/Email/);
            const submitButton = getByText(/Update Settings/);

            await userEvent.clear(urlInput);
            await userEvent.clear(usernameInput);
            await userEvent.clear(bioInput);
            await userEvent.clear(emailInput);

            await userEvent.type(emailInput, 'mail@mail.com');
            await userEvent.type(usernameInput, 'username');
            expect(submitButton).not.toHaveAttribute('disabled');
        });
    });

    describe('When updateSettings', () => {
        it('Then call store.updateSettings with updated form values', async () => {
            const { getByPlaceholderText, getByText } = await setup();

            const updatedSettings = {
                image: 'new image',
                username: 'new username',
                bio: 'new bio',
                email: 'newemail@mail.com',
                token: '',
            };

            const urlInput = getByPlaceholderText(/URL of profile picture/);
            const usernameInput = getByPlaceholderText(/Your Username/);
            const bioInput = getByPlaceholderText(/Short bio about you/);
            const emailInput = getByPlaceholderText(/Email/);

            await userEvent.clear(urlInput);
            await userEvent.type(urlInput, updatedSettings.image);

            await userEvent.clear(usernameInput);
            await userEvent.type(usernameInput, updatedSettings.username);

            await userEvent.clear(bioInput);
            await userEvent.type(bioInput, updatedSettings.bio);

            await userEvent.clear(emailInput);
            await userEvent.type(emailInput, updatedSettings.email);

            const submitButton = getByText(/Update Settings/);
            await userEvent.click(submitButton);

            expect(mockedStore.updateSettings).toHaveBeenCalledWith(updatedSettings);
        });
    });

    describe('When logout', () => {
        it('Then call store.logout', async () => {
            const { getByText } = await setup();
            const logoutButton = getByText(/Or click here to logout/);

            await userEvent.click(logoutButton);
            expect(mockedStore.logout).toHaveBeenCalled();
        });
    });
});
