import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { Header } from './header.component';

describe(Header.name, () => {
    async function setup(
        componentProperties: { isAuthenticated?: boolean; username?: string } = {
            isAuthenticated: false,
            username: '',
        }
    ) {
        return await render(Header, { componentProperties });
    }

    it('Then create component', async () => {
        const { fixture } = await setup();
        expect(fixture.componentInstance).toBeTruthy();
    });

    describe('When render', () => {
        it('Then show brand link', async () => {
            const { debugElement } = await setup();

            const brandLink = debugElement.query(By.css('.navbar-brand'));

            expect(brandLink.nativeElement).toHaveTextContent(/conduit/);
            expect(brandLink.nativeElement).toHaveAttribute('href', '/');
        });

        it('Then show "home" nav item', async () => {
            const { getByText } = await setup();

            const homeLink = getByText(/Home/);

            expect(homeLink).toBeTruthy();
            expect(homeLink).toHaveAttribute('href', '/');
        });

        describe('Given is authenticated', () => {
            it('Then show "New Article" nav item', async () => {
                const { getByText } = await setup({ isAuthenticated: true });

                const newArticleLink = getByText(/New Article/);

                expect(newArticleLink).toBeTruthy();
                expect(newArticleLink).toHaveAttribute('href', '/editor');
            });

            it('Then show "Settings" nav item', async () => {
                const { getByText } = await setup({ isAuthenticated: true });

                const settingsLink = getByText(/Settings/);

                expect(settingsLink).toBeTruthy();
                expect(settingsLink).toHaveAttribute('href', '/settings');
            });

            it('Then show "username" nav item', async () => {
                const mockedUsername = 'username';
                const { getByText } = await setup({
                    isAuthenticated: true,
                    username: mockedUsername,
                });

                const usernameLink = getByText(new RegExp(mockedUsername));

                expect(usernameLink).toBeTruthy();
                expect(usernameLink).toHaveAttribute('href', `/profile/${mockedUsername}`);
            });
        });

        describe('Given is not authenticated', () => {
            it('Then show "Sign In" nav item', async () => {
                const { getByText } = await setup();

                const signInLink = getByText(/Sign in/);

                expect(signInLink).toBeTruthy();
                expect(signInLink).toHaveAttribute('href', '/login');
            });

            it('Then show "Sign Up" nav item', async () => {
                const { getByText } = await setup();

                const signUpLink = getByText(/Sign up/);

                expect(signUpLink).toBeTruthy();
                expect(signUpLink).toHaveAttribute('href', '/register');
            });
        });
    });
});
