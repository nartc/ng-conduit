import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ReplaySubject } from 'rxjs';
import { AuthLayout } from '../shared/ui/auth-layout/auth-layout.component';
import { Login } from './login.component';
import { LoginStore } from './login.store';

describe(Login.name, () => {
    let mockedStore: jasmine.SpyObj<LoginStore>;

    let mockedLoginErrors$: ReplaySubject<{
        errors: string[];
        hasError: boolean;
    }>;

    async function setup(loginErrors: string[] = []) {
        mockedLoginErrors$ = new ReplaySubject(1);
        mockedLoginErrors$.next({
            errors: loginErrors,
            hasError: loginErrors.length > 0,
        });

        mockedStore = jasmine.createSpyObj<LoginStore>(LoginStore.name, ['login'], {
            loginErrors$: mockedLoginErrors$.asObservable(),
        });

        return await render(Login, {
            componentProviders: [{ provide: LoginStore, useValue: mockedStore }],
        });
    }

    it('Then create component', async () => {
        const { fixture } = await setup();
        expect(fixture.componentInstance).toBeTruthy();
    });

    describe('When render', () => {
        it('Then show Auth Layout', async () => {
            const { debugElement } = await setup();

            const authLayout = debugElement.query(By.directive(AuthLayout));

            expect(authLayout).toBeTruthy();
            expect(authLayout.componentInstance).toBeInstanceOf(AuthLayout);
        });

        it('Then show title', async () => {
            const { debugElement } = await setup();

            const signInTitle = debugElement.query(By.css('h1'));
            expect(signInTitle).toBeTruthy();
            expect(signInTitle.nativeElement).toHaveTextContent(/Sign in/);
        });

        it('Then show "Need an account" link', async () => {
            const { getByText } = await setup();

            const needAnAccountLink = getByText(/Need an account/);
            expect(needAnAccountLink).toBeTruthy();
            expect(needAnAccountLink).toHaveAttribute('href', '/register');
        });

        describe('Given no login errors', () => {
            it('Then show no error-messages element', async () => {
                const { debugElement } = await setup();

                const errorMessagesList = debugElement.query(By.css('.error-messages'));
                expect(errorMessagesList).toBeFalsy();
            });
        });

        describe('Given login errors', () => {
            it('Then show error-messages element', async () => {
                const errorMessages = ['email is invalid', 'email already exists'];
                const { debugElement } = await setup(errorMessages);

                const errorMessagesList = debugElement.query(By.css('.error-messages'));
                expect(errorMessagesList).toBeTruthy();

                const errors = errorMessagesList.queryAll(By.css('li'));

                errors.forEach((error, index) => {
                    expect(error.nativeElement).toHaveTextContent(errorMessages[index]);
                });
            });
        });

        it('Then show form', async () => {
            const { debugElement } = await setup();
            const form = debugElement.query(By.css('form'));
            expect(form).toBeTruthy();
        });

        it('Then show correct controls', async () => {
            const { getByPlaceholderText, debugElement } = await setup();

            const emailInput = getByPlaceholderText(/Email/);
            const passwordInput = getByPlaceholderText(/Password/);
            const submitButton = debugElement.query(By.css('button[type=submit]'));

            expect(emailInput).toBeTruthy();
            expect(passwordInput).toBeTruthy();
            expect(submitButton).toBeTruthy();
        });
    });

    describe('When edit form', () => {
        describe('Given invalid email', () => {
            it('Then cannot submit', async () => {
                const { getByPlaceholderText, debugElement } = await setup();

                const emailInput = getByPlaceholderText(/Email/);
                await userEvent.type(emailInput, 'invalidemail');

                const submitButton = debugElement.query(By.css('button[type=submit]'));
                expect(submitButton.nativeElement).toHaveAttribute('disabled');
            });
        });

        describe('Given valid email', () => {
            it('Then can submit', async () => {
                const { getByPlaceholderText, debugElement } = await setup();

                const emailInput = getByPlaceholderText(/Email/);
                await userEvent.type(emailInput, 'validemail@email.com');

                const submitButton = debugElement.query(By.css('button[type=submit]'));
                expect(submitButton.nativeElement).not.toHaveAttribute('disabled');
            });
        });
    });

    describe('When submit form', () => {
        it('Then calls store.login with form value', async () => {
            const { fixture, getByPlaceholderText, debugElement } = await setup();

            const emailInput = getByPlaceholderText(/Email/);
            await userEvent.type(emailInput, 'validemail@email.com');

            const passwordInput = getByPlaceholderText(/Password/);
            await userEvent.type(passwordInput, '123456');

            const submitButton = debugElement.query(By.css('button[type=submit]'));
            await userEvent.click(submitButton.nativeElement);

            expect(mockedStore.login).toHaveBeenCalledWith(fixture.componentInstance.form.getRawValue());
        });
    });
});
