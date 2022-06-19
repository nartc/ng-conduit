import { provideComponentStore } from '@ngrx/component-store';
import { render } from '@testing-library/angular';
import { of, take, throwError } from 'rxjs';
import { ApiClient, LoginUser } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { LocalStorageService } from '../shared/data-access/local-storage.service';
import { getMockedUser } from '../testing.spec';
import { LoginStore } from './login.store';

describe(LoginStore.name, () => {
  let store: LoginStore;

  let mockedApiClient: jasmine.SpyObj<ApiClient>;
  let mockedLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockedAuthStore: jasmine.SpyObj<AuthStore>;

  async function setup() {
    mockedApiClient = jasmine.createSpyObj<ApiClient>(ApiClient.name, [
      'login',
    ]);
    mockedLocalStorageService = jasmine.createSpyObj<LocalStorageService>(
      LocalStorageService.name,
      ['setItem']
    );
    mockedAuthStore = jasmine.createSpyObj<AuthStore>(AuthStore.name, [
      'authenticate',
    ]);

    const { debugElement } = await render('', {
      providers: [
        { provide: ApiClient, useValue: mockedApiClient },
        { provide: LocalStorageService, useValue: mockedLocalStorageService },
        { provide: AuthStore, useValue: mockedAuthStore },
        provideComponentStore(LoginStore),
      ],
    });

    store = debugElement.injector.get(LoginStore);
  }

  describe('When init', () => {
    it('Then loginErrors$ has initial state', async () => {
      await setup();

      store.loginErrors$.pipe(take(1)).subscribe((loginErrors) => {
        expect(loginErrors).toEqual({ errors: [], hasError: false });
      });
    });
  });

  describe('When login', () => {
    const loginUser: LoginUser = {
      email: 'email',
      password: 'password',
    };

    describe('Given login failed and has login errors', () => {
      it('Then loginErrors$ has errors', async () => {
        await setup();

        mockedApiClient.login.and.returnValue(
          throwError(() => ({
            errors: {
              email: ['is invalid', 'already exists'],
            },
          }))
        );

        store.login(loginUser);

        expect(mockedApiClient.login).toHaveBeenCalledWith({ user: loginUser });
        store.loginErrors$.pipe(take(1)).subscribe((loginErrors) => {
          expect(loginErrors).toEqual({
            hasError: true,
            errors: ['email is invalid', 'email already exists'],
          });
        });
      });
    });

    describe('Given login failed and has no login errors', () => {
      it('Then loginErrors$ still has no errors', async () => {
        await setup();

        mockedApiClient.login.and.returnValue(throwError(() => 'error login'));

        store.login(loginUser);

        expect(mockedApiClient.login).toHaveBeenCalledWith({ user: loginUser });
        store.loginErrors$.pipe(take(1)).subscribe((loginErrors) => {
          expect(loginErrors).toEqual({ hasError: false, errors: [] });
        });
      });
    });

    describe('Given login success', () => {
      const user = getMockedUser();
      it('Then save response in local storage', async () => {
        await setup();

        mockedApiClient.login.and.returnValue(of({ user }));

        store.login(loginUser);

        expect(mockedApiClient.login).toHaveBeenCalledWith({ user: loginUser });
        expect(mockedLocalStorageService.setItem.calls.allArgs()).toEqual([
          ['ng-conduit-token', user.token],
          ['ng-conduit-user', user],
        ]);
      });

      it('Then call authStore.authenticate', async () => {
        await setup();

        mockedApiClient.login.and.returnValue(of({ user }));

        store.login(loginUser);

        expect(mockedApiClient.login).toHaveBeenCalledWith({ user: loginUser });
        expect(mockedAuthStore.authenticate).toHaveBeenCalled();
      });
    });
  });
});
