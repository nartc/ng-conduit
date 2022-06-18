import { Router } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { render } from '@testing-library/angular';
import { of, take } from 'rxjs';
import { ApiClient, Profile, User } from './api';
import { AuthStore } from './auth.store';
import { LocalStorageService } from './local-storage.service';

describe(AuthStore.name, () => {
  let store: AuthStore;

  let mockedApiClient: jasmine.SpyObj<ApiClient>;
  let mockedLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockedRouter: jasmine.SpyObj<Router>;

  async function setup() {
    mockedApiClient = jasmine.createSpyObj<ApiClient>(ApiClient.name, [
      'getCurrentUser',
      'getProfileByUsername',
    ]);
    mockedLocalStorageService = jasmine.createSpyObj<LocalStorageService>(
      LocalStorageService.name,
      ['setItem', 'removeItem', 'getItem']
    );
    mockedRouter = jasmine.createSpyObj<Router>(Router.name, ['navigate']);

    const { debugElement } = await render('', {
      providers: [
        { provide: ApiClient, useValue: mockedApiClient },
        { provide: LocalStorageService, useValue: mockedLocalStorageService },
        { provide: Router, useValue: mockedRouter },
        provideComponentStore(AuthStore),
      ],
    });

    store = debugElement.injector.get(AuthStore);
  }

  it('should create store instance', async () => {
    await setup();
    expect(store).toBeTruthy();
  });

  describe('Given not logged in', () => {
    describe('When init', () => {
      function act() {
        store.init();
      }

      it('Then call localStorage.getItem', async () => {
        await setup();
        act();

        expect(mockedLocalStorageService.getItem).toHaveBeenCalledWith(
          'ng-conduit-token'
        );
      });

      it('Then not call apiClient.getCurrentUser', async () => {
        await setup();
        act();

        expect(mockedApiClient.getCurrentUser).not.toHaveBeenCalled();
      });

      it('Then not call apiClient.getProfileByUsername', async () => {
        await setup();
        act();

        expect(mockedApiClient.getProfileByUsername).not.toHaveBeenCalled();
      });

      it('Then be unauthenticated', async () => {
        await setup();
        act();

        store.isAuthenticated$.pipe(take(1)).subscribe((isAuthenticated) => {
          expect(isAuthenticated).toBeFalse();
        });

        store.auth$.pipe(take(1)).subscribe((auth) => {
          expect(auth).toEqual({
            isAuthenticated: false,
            user: null,
            profile: null,
          });
        });
      });
    });

    describe('When authenticate', () => {
      function act() {
        store.authenticate();
      }

      it('Then call localStorage.getItem', async () => {
        await setup();
        act();

        expect(mockedLocalStorageService.getItem).toHaveBeenCalledWith(
          'ng-conduit-token'
        );
      });

      it('Then not call apiClient.getCurrentUser', async () => {
        await setup();
        act();
        expect(mockedApiClient.getCurrentUser).not.toHaveBeenCalled();
      });

      it('Then call router.navigate', async () => {
        await setup();
        act();
        expect(mockedRouter.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('Given logged in', () => {
    const currentUser: User = {
      image: 'image',
      email: 'email',
      username: 'username',
      token: 'token',
      bio: 'bio',
    };

    const currentUserProfile: Profile = {
      bio: currentUser.bio,
      image: currentUser.image,
      username: currentUser.username,
      following: false,
    };

    function arrange() {
      mockedLocalStorageService.getItem
        .withArgs('ng-conduit-token')
        .and.returnValue(currentUser.token);

      mockedApiClient.getCurrentUser.and.returnValue(of({ user: currentUser }));
      mockedApiClient.getProfileByUsername
        .withArgs(currentUser.username)
        .and.returnValue(of({ profile: currentUserProfile }));
    }

    describe('When init', () => {
      function act() {
        store.init();
      }

      it('Then call localStorage.getItem', async () => {
        await setup();
        arrange();
        act();

        expect(mockedLocalStorageService.getItem).toHaveBeenCalledWith(
          'ng-conduit-token'
        );
      });

      it('Then call apiClient.getCurrentUser', async () => {
        await setup();
        arrange();
        act();

        expect(mockedApiClient.getCurrentUser).toHaveBeenCalled();
      });

      it('Then call apiClient.getProfileByUsername', async () => {
        await setup();
        arrange();
        act();

        expect(mockedApiClient.getProfileByUsername).toHaveBeenCalledWith(
          currentUser.username
        );
      });

      it('Then call localStorage.setItem with currentUser', async () => {
        await setup();
        arrange();
        act();

        expect(mockedLocalStorageService.setItem).toHaveBeenCalledWith(
          'ng-conduit-user',
          currentUser
        );
      });

      it('Then be authenticated', async () => {
        await setup();
        arrange();
        act();

        store.auth$.pipe(take(1)).subscribe((auth) => {
          expect(auth).toEqual({
            isAuthenticated: true,
            user: currentUser,
            profile: currentUserProfile,
          });
        });
      });
    });

    describe('When authenticate', () => {
      function act() {
        store.authenticate();
      }

      it('Then call localStorage.getItem', async () => {
        await setup();
        arrange();
        act();

        expect(mockedLocalStorageService.getItem).toHaveBeenCalledWith(
          'ng-conduit-token'
        );
      });

      it('Then call apiClient.getCurrentUser', async () => {
        await setup();
        arrange();
        act();

        expect(mockedApiClient.getCurrentUser).toHaveBeenCalled();
      });

      it('Then call localStorage.setItem with currentUser', async () => {
        await setup();
        arrange();
        act();

        expect(mockedLocalStorageService.setItem).toHaveBeenCalledWith(
          'ng-conduit-user',
          currentUser
        );
      });

      it('Then be authenticated', async () => {
        await setup();
        arrange();
        act();

        store.auth$.pipe(take(1)).subscribe((auth) => {
          expect(auth).toEqual({
            isAuthenticated: true,
            user: currentUser,
            profile: null,
          });
        });
      });

      it('Then call router.navigate', async () => {
        await setup();
        arrange();
        act();

        expect(mockedRouter.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('When logout', () => {
    function act() {
      store.logout();
    }

    it('Then call localStorage.removeItem', async () => {
      await setup();
      act();

      expect(mockedLocalStorageService.removeItem).toHaveBeenCalledTimes(2);
    });

    it('Then call localStorage.getItem', async () => {
      await setup();
      act();

      expect(mockedLocalStorageService.getItem).toHaveBeenCalledWith(
        'ng-conduit-token'
      );
    });

    it('Then not call apiClient.getCurrentUser', async () => {
      await setup();
      act();

      expect(mockedApiClient.getCurrentUser).not.toHaveBeenCalled();
    });

    it('Then redirect to /', async () => {
      await setup();
      act();

      expect(mockedRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('Then be unauthenticated', async () => {
      await setup();
      act();

      store.auth$.pipe(take(1)).subscribe((auth) => {
        expect(auth).toEqual({
          isAuthenticated: false,
          user: null,
          profile: null,
        });
      });
    });
  });
});
