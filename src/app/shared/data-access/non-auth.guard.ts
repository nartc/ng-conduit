import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthStore } from './auth.store';

export function nonAuthGuard(): CanMatchFn {
    return () => {
        const router = inject(Router);
        return inject(AuthStore).isAuthenticated$.pipe(
            map((isAuthenticated) => {
                if (!isAuthenticated) return !isAuthenticated;
                return router.parseUrl('/');
            }),
            take(1)
        );
    };
}
