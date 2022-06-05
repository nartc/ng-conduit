import { inject, Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { injectComponentStore } from '../di/store';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class NonAuthGuard implements CanActivate, CanLoad {
  private readonly authStore = injectComponentStore(AuthStore);
  private readonly router = inject(Router);

  canLoad(): Observable<boolean | UrlTree> {
    return this.isAuthenticated$();
  }

  canActivate(): Observable<boolean | UrlTree> {
    return this.isAuthenticated$();
  }

  private isAuthenticated$() {
    return this.authStore.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) return isAuthenticated;
        return this.router.parseUrl('/');
      }),
      take(1)
    );
  }
}
