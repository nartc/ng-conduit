import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { render } from '@testing-library/angular';
import { ReplaySubject } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthStore } from './auth.store';

function testRouteGuard({
  routes,
  testUrl,
  type,
}: {
  routes: Routes;
  testUrl: string;
  type: string;
}) {
  describe(AuthGuard.name + `: ${type}`, () => {
    let isAuthenticated$: ReplaySubject<boolean>;
    let mockedAuthStore: jasmine.SpyObj<AuthStore>;
    let router: Router;
    let location: Location;

    async function setup() {
      isAuthenticated$ = new ReplaySubject<boolean>(1);
      mockedAuthStore = jasmine.createSpyObj<AuthStore>(AuthStore.name, [], {
        isAuthenticated$,
      });

      const { debugElement } = await render(DummyRootComponent, {
        imports: [
          RouterTestingModule.withRoutes([
            { path: '', component: DummyHomeComponent },
            ...routes,
          ]),
        ],
        providers: [{ provide: AuthStore, useValue: mockedAuthStore }],
      });

      router = debugElement.injector.get(Router);
      location = debugElement.injector.get(Location);
    }

    describe('Given a user is authenticated', () => {
      let canNavigate: boolean;

      async function act() {
        isAuthenticated$.next(true);
        canNavigate = await router.navigateByUrl(testUrl);
      }

      it('Then allow access', async () => {
        await setup();
        await act();
        expect(canNavigate).toEqual(true);
      });

      it('Then load component', async () => {
        await setup();
        await act();
        expect(location.path()).toEqual(testUrl);
      });
    });

    describe('Given user is not authenticated', () => {
      let canNavigate: boolean;

      async function act() {
        isAuthenticated$.next(false);
        canNavigate = await router.navigateByUrl(testUrl);
      }

      it('Then follow through navigation', async () => {
        await setup();
        await act();
        expect(canNavigate).toEqual(true);
      });

      it('Then redirect to /', async () => {
        await setup();
        await act();
        expect(location.path()).toEqual('/');
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
      canActivate: [AuthGuard],
      component: DummyTargetComponent,
    },
  ],
  testUrl: '/target',
  type: 'canActivate',
});

testRouteGuard({
  routes: [
    {
      path: 'target',
      canActivateChild: [AuthGuard],
      children: [{ path: '', component: DummyTargetComponent }],
    },
  ],
  testUrl: '/target',
  type: 'canActivateChild',
});
