import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class NonAuthGuard implements CanActivate, CanLoad {
  constructor(private authStore: AuthStore, private router: Router) {}

  canLoad(): Observable<boolean | UrlTree> {
    return this.isAuthenticated$();
  }

  canActivate(): Observable<boolean | UrlTree> {
    return this.isAuthenticated$();
  }

  private isAuthenticated$() {
    return this.authStore.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) return !isAuthenticated;
        return this.router.parseUrl('/');
      }),
      take(1)
    );
  }
}
