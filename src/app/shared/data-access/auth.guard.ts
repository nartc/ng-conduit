import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AUTH_STORE } from './auth/auth.di';

export function authGuard(): CanMatchFn {
    return () => {
        const router = inject(Router);
        return inject(AUTH_STORE).isAuthenticated$.pipe(
            map((isAuthenticated) => {
                if (isAuthenticated) return isAuthenticated;
                return router.parseUrl('/');
            }),
            take(1)
        );
    };
}
