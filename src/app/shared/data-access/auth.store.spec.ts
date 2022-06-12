import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, take } from 'rxjs';
import { ApiClient, Profile, User } from './api';
import { AuthStore } from './auth.store';
import { LocalStorageService } from './local-storage.service';

describe(AuthStore.name, () => {
  let store: AuthStore;

  let mockedApiClient: jasmine.SpyObj<ApiClient>;
  let mockedLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockedRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockedApiClient = jasmine.createSpyObj<ApiClient>(ApiClient.name, [
      'getCurrentUser',
      'getProfileByUsername',
    ]);
    mockedLocalStorageService = jasmine.createSpyObj<LocalStorageService>(
      LocalStorageService.name,
      ['setItem', 'removeItem', 'getItem']
    );
    mockedRouter = jasmine.createSpyObj<Router>(Router.name, ['navigate']);

    store = new AuthStore(
      mockedApiClient,
      mockedLocalStorageService,
      mockedRouter
    );
  });

  it('should create store instance', () => {
    expect(store).toBeTruthy();
  });

  describe('not logged in', () => {
    describe('init', () => {
      beforeEach(() => {
        store.init();
      });

      it('should call localStorage.getItem', () => {
        expect(mockedLocalStorageService.getItem).toHaveBeenCalledWith(
          'ng-conduit-token'
        );
      });

      it('but should not call apiClient.getCurrentUser', () => {
        expect(mockedApiClient.getCurrentUser).not.toHaveBeenCalled();
      });

      it('and should not call apiClient.getProfileByUsername', () => {
        expect(mockedApiClient.getProfileByUsername).not.toHaveBeenCalled();
      });

      it('and should be unauthenticated', fakeAsync(() => {
        flushMicrotasks();
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
      }));
    });

    describe('authenticate', () => {
      beforeEach(() => {
        store.authenticate();
      });

      it('should call localStorage.getItem', () => {
        expect(mockedLocalStorageService.getItem).toHaveBeenCalledWith(
          'ng-conduit-token'
        );
      });

      it('but should not call apiClient.getCurrentUser', () => {
        expect(mockedApiClient.getCurrentUser).not.toHaveBeenCalled();
      });

      it('and should call router.navigate', () => {
        expect(mockedRouter.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('logged in', () => {
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

    beforeEach(() => {
      mockedLocalStorageService.getItem
        .withArgs('ng-conduit-token')
        .and.returnValue(currentUser.token);

      mockedApiClient.getCurrentUser.and.returnValue(of({ user: currentUser }));
      mockedApiClient.getProfileByUsername
        .withArgs(currentUser.username)
        .and.returnValue(of({ profile: currentUserProfile }));
    });

    describe('init', () => {
      beforeEach(() => {
        store.init();
      });

      it('should call localStorage.getItem', () => {
        expect(mockedLocalStorageService.getItem).toHaveBeenCalledWith(
          'ng-conduit-token'
        );
      });

      it('and should call apiClient.getCurrentUser', () => {
        expect(mockedApiClient.getCurrentUser).toHaveBeenCalled();
      });

      it('and should call apiClient.getProfileByUsername', () => {
        expect(mockedApiClient.getProfileByUsername).toHaveBeenCalledWith(
          currentUser.username
        );
      });

      it('and should call localStorage.setItem with currentUser', () => {
        expect(mockedLocalStorageService.setItem).toHaveBeenCalledWith(
          'ng-conduit-user',
          currentUser
        );
      });

      it('and should be authenticated', fakeAsync(() => {
        flushMicrotasks();

        store.auth$.pipe(take(1)).subscribe((auth) => {
          expect(auth).toEqual({
            isAuthenticated: true,
            user: currentUser,
            profile: currentUserProfile,
          });
        });
      }));
    });

    describe('authenticate', () => {
      beforeEach(() => {
        store.authenticate();
      });

      it('should call localStorage.getItem', () => {
        expect(mockedLocalStorageService.getItem).toHaveBeenCalledWith(
          'ng-conduit-token'
        );
      });

      it('and should call apiClient.getCurrentUser', () => {
        expect(mockedApiClient.getCurrentUser).toHaveBeenCalled();
      });

      it('and should call localStorage.setItem with currentUser', () => {
        expect(mockedLocalStorageService.setItem).toHaveBeenCalledWith(
          'ng-conduit-user',
          currentUser
        );
      });

      it('and should be authenticated', fakeAsync(() => {
        flushMicrotasks();

        store.auth$.pipe(take(1)).subscribe((auth) => {
          expect(auth).toEqual({
            isAuthenticated: true,
            user: currentUser,
            profile: null,
          });
        });
      }));

      it('and should call router.navigate', () => {
        expect(mockedRouter.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      store.logout();
    });

    it('should call localStorage.removeItem', () => {
      expect(mockedLocalStorageService.removeItem).toHaveBeenCalledTimes(2);
    });

    it('and should call localStorage.getItem', () => {
      expect(mockedLocalStorageService.getItem).toHaveBeenCalledWith(
        'ng-conduit-token'
      );
    });

    it('but should not call apiClient.getCurrentUser', () => {
      expect(mockedApiClient.getCurrentUser).not.toHaveBeenCalled();
    });

    it('and should redirect to /', () => {
      expect(mockedRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('and should be unauthenticated', fakeAsync(() => {
      flushMicrotasks();

      store.auth$.pipe(take(1)).subscribe((auth) => {
        expect(auth).toEqual({
          isAuthenticated: false,
          user: null,
          profile: null,
        });
      });
    }));
  });
});
