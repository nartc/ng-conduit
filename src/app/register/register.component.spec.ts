import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ReplaySubject } from 'rxjs';
import { AuthLayout } from '../shared/ui/auth-layout/auth-layout.component';
import { Register } from './register.component';
import { RegisterStore } from './register.store';

describe(Register.name, () => {
  let mockedStore: jasmine.SpyObj<RegisterStore>;

  let mockedRegisterErrors$: ReplaySubject<{
    errors: string[];
    hasError: boolean;
  }>;

  async function setup(registerErrors: string[] = []) {
    mockedRegisterErrors$ = new ReplaySubject(1);
    mockedRegisterErrors$.next({
      errors: registerErrors,
      hasError: registerErrors.length > 0,
    });

    mockedStore = jasmine.createSpyObj<RegisterStore>(
      RegisterStore.name,
      ['register'],
      {
        registerErrors$: mockedRegisterErrors$.asObservable(),
      }
    );

    return await render(Register, {
      componentProviders: [{ provide: RegisterStore, useValue: mockedStore }],
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
      expect(signInTitle.nativeElement).toHaveTextContent(/Sign up/);
    });

    it('Then show "Have an account" link', async () => {
      const { getByText } = await setup();

      const haveAnAccountLink = getByText(/Have an account/);
      expect(haveAnAccountLink).toBeTruthy();
      expect(haveAnAccountLink).toHaveAttribute('href', '/login');
    });

    describe('Given no register errors', () => {
      it('Then show no error-messages element', async () => {
        const { debugElement } = await setup();

        const errorMessagesList = debugElement.query(By.css('.error-messages'));
        expect(errorMessagesList).toBeFalsy();
      });
    });

    describe('Given register errors', () => {
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
      const usernameInput = getByPlaceholderText(/Username/);
      const submitButton = debugElement.query(By.css('button[type=submit]'));

      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(usernameInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });
  });

  describe('When edit form', () => {
    describe('Given invalid form', () => {
      it('Then cannot submit', async () => {
        const { fixture, getByPlaceholderText, debugElement } = await setup();

        const submitButton = debugElement.query(By.css('button[type=submit]'));
        const emailInput = getByPlaceholderText(/Email/);
        const passwordInput = getByPlaceholderText(/Password/);
        const usernameInput = getByPlaceholderText(/Username/);

        // empty controls - invalid
        expect(submitButton.nativeElement).toHaveAttribute('disabled');

        // invalid email
        await userEvent.type(emailInput, 'invalidemail');
        await userEvent.type(passwordInput, '12345678');
        await userEvent.type(usernameInput, 'username');
        expect(submitButton.nativeElement).toHaveAttribute('disabled');

        // empty email
        fixture.componentInstance.form.reset();

        await userEvent.type(passwordInput, '12345678');
        await userEvent.type(usernameInput, 'username');
        expect(submitButton.nativeElement).toHaveAttribute('disabled');

        // empty password
        fixture.componentInstance.form.reset();

        await userEvent.type(emailInput, 'email@email.com');
        await userEvent.type(usernameInput, 'username');
        expect(submitButton.nativeElement).toHaveAttribute('disabled');

        // short password
        fixture.componentInstance.form.reset();

        await userEvent.type(emailInput, 'email@email.com');
        await userEvent.type(passwordInput, '123456');
        await userEvent.type(usernameInput, 'username');
        expect(submitButton.nativeElement).toHaveAttribute('disabled');

        // empty username
        fixture.componentInstance.form.reset();

        await userEvent.type(emailInput, 'email@email.com');
        await userEvent.type(passwordInput, '12345678');
        expect(submitButton.nativeElement).toHaveAttribute('disabled');
      });
    });

    describe('Given valid form', () => {
      it('Then can submit', async () => {
        const { getByPlaceholderText, debugElement } = await setup();

        const emailInput = getByPlaceholderText(/Email/);
        const passwordInput = getByPlaceholderText(/Password/);
        const usernameInput = getByPlaceholderText(/Username/);

        await userEvent.type(emailInput, 'validemail@email.com');
        await userEvent.type(passwordInput, '12345678');
        await userEvent.type(usernameInput, 'username');

        const submitButton = debugElement.query(By.css('button[type=submit]'));
        expect(submitButton.nativeElement).not.toHaveAttribute('disabled');
      });
    });
  });

  describe('When submit form', () => {
    it('Then calls store.register with form value', async () => {
      const { fixture, getByPlaceholderText, debugElement } = await setup();

      const emailInput = getByPlaceholderText(/Email/);
      await userEvent.type(emailInput, 'validemail@email.com');

      const passwordInput = getByPlaceholderText(/Password/);
      await userEvent.type(passwordInput, '12345678');

      const usernameInput = getByPlaceholderText(/Username/);
      await userEvent.type(usernameInput, 'username');

      const submitButton = debugElement.query(By.css('button[type=submit]'));
      await userEvent.click(submitButton.nativeElement);

      expect(mockedStore.register).toHaveBeenCalledWith(
        fixture.componentInstance.form.getRawValue()
      );
    });
  });
});
