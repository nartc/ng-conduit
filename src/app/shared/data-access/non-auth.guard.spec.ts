import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplaySubject } from 'rxjs';
import { AuthStore } from './auth.store';
import { NonAuthGuard } from './non-auth.guard';

function testRouteGuard({
  routes,
  testUrl,
  type,
}: {
  routes: Routes;
  testUrl: string;
  type: string;
}) {
  describe(NonAuthGuard.name + `: ${type}`, () => {
    let isAuthenticated$: ReplaySubject<boolean>;
    let mockedAuthStore: jasmine.SpyObj<AuthStore>;
    let router: Router;
    let location: Location;

    beforeEach(() => {
      isAuthenticated$ = new ReplaySubject<boolean>(1);
      mockedAuthStore = jasmine.createSpyObj<AuthStore>(AuthStore.name, [], {
        isAuthenticated$,
      });

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([
            { path: '', component: DummyHomeComponent },
            ...routes,
          ]),
        ],
        providers: [{ provide: AuthStore, useValue: mockedAuthStore }],
      }).createComponent(DummyRootComponent);

      router = TestBed.inject(Router);
      location = TestBed.inject(Location);
    });

    describe('when user is authenticated', () => {
      let canNavigate: boolean;

      beforeEach(async () => {
        isAuthenticated$.next(true);
        canNavigate = await router.navigateByUrl(testUrl);
      });

      it('should follow through navigation', () => {
        expect(canNavigate).toEqual(true);
      });

      it('should redirect to /', () => {
        expect(location.path()).toEqual('/');
      });
    });

    describe('when user is not authenticated', () => {
      let canNavigate: boolean;

      beforeEach(async () => {
        isAuthenticated$.next(false);
        canNavigate = await router.navigateByUrl(testUrl);
      });

      it('should allow access', () => {
        expect(canNavigate).toEqual(true);
      });

      it('should load component', () => {
        expect(location.path()).toEqual('/target');
      });
    });
  });
}

@Component({
  standalone: true,
  template: ``,
})
class DummyTargetComponent {}

@Component({
  standalone: true,
  template: ``,
})
class DummyHomeComponent {}

@Component({
  standalone: true,
  template: '<router-outlet></router-outlet>',
  imports: [RouterTestingModule],
})
class DummyRootComponent {}

testRouteGuard({
  routes: [
    {
      path: 'target',
      canActivate: [NonAuthGuard],
      component: DummyTargetComponent,
    },
  ],
  testUrl: '/target',
  type: 'canActivate',
});
