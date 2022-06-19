import { provideComponentStore } from '@ngrx/component-store';
import { render } from '@testing-library/angular';
import { of, take, throwError } from 'rxjs';
import { ApiClient, NewUser } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { LocalStorageService } from '../shared/data-access/local-storage.service';
import { getMockedUser } from '../testing.spec';
import { RegisterStore } from './register.store';

describe(RegisterStore.name, () => {
  let store: RegisterStore;

  let mockedApiClient: jasmine.SpyObj<ApiClient>;
  let mockedLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockedAuthStore: jasmine.SpyObj<AuthStore>;

  async function setup() {
    mockedApiClient = jasmine.createSpyObj<ApiClient>(ApiClient.name, [
      'createUser',
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
        provideComponentStore(RegisterStore),
      ],
    });

    store = debugElement.injector.get(RegisterStore);
  }

  describe('When init', () => {
    it('Then registerErrors$ has initial state', async () => {
      await setup();

      store.registerErrors$.pipe(take(1)).subscribe((registerErrors) => {
        expect(registerErrors).toEqual({ errors: [], hasError: false });
      });
    });
  });

  describe('When register', () => {
    const newUser: NewUser = {
      email: 'email',
      password: 'password',
      username: 'username',
    };

    describe('Given createUser failed and has register errors', () => {
      it('Then registerErrors$ has errors', async () => {
        await setup();

        mockedApiClient.createUser.and.returnValue(
          throwError(() => ({
            errors: {
              email: ['is invalid'],
              password: ['is too short'],
            },
          }))
        );

        store.register(newUser);

        expect(mockedApiClient.createUser).toHaveBeenCalledWith({
          user: newUser,
        });
        store.registerErrors$.pipe(take(1)).subscribe((registerErrors) => {
          expect(registerErrors).toEqual({
            hasError: true,
            errors: ['email is invalid', 'password is too short'],
          });
        });
      });
    });

    describe('Given createUser failed and has no register errors', () => {
      it('Then registerErrors$ still has no errors', async () => {
        await setup();

        mockedApiClient.createUser.and.returnValue(
          throwError(() => 'error register')
        );

        store.register(newUser);

        expect(mockedApiClient.createUser).toHaveBeenCalledWith({
          user: newUser,
        });
        store.registerErrors$.pipe(take(1)).subscribe((registerErrors) => {
          expect(registerErrors).toEqual({ hasError: false, errors: [] });
        });
      });
    });

    describe('Given createUser success', () => {
      const user = getMockedUser();
      it('Then save response in local storage', async () => {
        await setup();

        mockedApiClient.createUser.and.returnValue(of({ user }));

        store.register(newUser);

        expect(mockedApiClient.createUser).toHaveBeenCalledWith({
          user: newUser,
        });
        expect(mockedLocalStorageService.setItem.calls.allArgs()).toEqual([
          ['ng-conduit-token', user.token],
          ['ng-conduit-user', user],
        ]);
      });

      it('Then call authStore.authenticate', async () => {
        await setup();

        mockedApiClient.createUser.and.returnValue(of({ user }));

        store.register(newUser);

        expect(mockedApiClient.createUser).toHaveBeenCalledWith({
          user: newUser,
        });
        expect(mockedAuthStore.authenticate).toHaveBeenCalled();
      });
    });
  });
});
