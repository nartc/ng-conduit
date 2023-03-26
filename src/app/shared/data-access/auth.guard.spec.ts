import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { render, RenderResult } from '@testing-library/angular';
import { ReplaySubject } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthStore } from './auth.store';

function testRouteGuard({ routes, testUrl, type }: { routes: Routes; testUrl: string; type: string }) {
    describe(AuthGuard.name + `: ${type}`, () => {
        let isAuthenticated$: ReplaySubject<boolean>;
        let mockedAuthStore: jasmine.SpyObj<AuthStore>;
        let location: Location;

        async function setup() {
            isAuthenticated$ = new ReplaySubject<boolean>(1);
            mockedAuthStore = jasmine.createSpyObj<AuthStore>(AuthStore.name, [], {
                isAuthenticated$,
            });

            const renderResult = await render(DummyRootComponent, {
                providers: [{ provide: AuthStore, useValue: mockedAuthStore }],
                routes: [{ path: '', component: DummyHomeComponent }, ...routes],
            });

            location = renderResult.debugElement.injector.get(Location);
            return renderResult;
        }

        describe('Given a user is authenticated', () => {
            let canNavigate: boolean;

            async function act(renderResult: RenderResult<DummyRootComponent>) {
                isAuthenticated$.next(true);
                canNavigate = await renderResult.navigate(testUrl);
            }

            it('Then allow access', async () => {
                const renderResult = await setup();
                await act(renderResult);
                expect(canNavigate).toEqual(true);
            });

            it('Then load component', async () => {
                const renderResult = await setup();
                await act(renderResult);

                const dummyTarget = renderResult.getByText(/dummy-target/);
                expect(dummyTarget).toBeTruthy();
            });
        });

        describe('Given user is not authenticated', () => {
            let canNavigate: boolean | null;

            async function act(renderResult: RenderResult<DummyRootComponent>) {
                isAuthenticated$.next(false);
                canNavigate = await renderResult.navigate(testUrl);
            }

            it('Then follow through navigation', async () => {
                const renderResult = await setup();
                await act(renderResult);
                expect(canNavigate).toEqual(null);
            });

            it('Then redirect to /', async () => {
                const renderResult = await setup();
                await act(renderResult);
                expect(location.path()).toEqual('/');
            });
        });
    });
}

@Component({
    standalone: true,
    template: `
        dummy-target
    `,
})
class DummyTargetComponent {}

@Component({
    standalone: true,
    template: `
        dummy-home
    `,
})
class DummyHomeComponent {}

@Component({
    standalone: true,
    template: '<router-outlet></router-outlet>',
    imports: [RouterModule],
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
