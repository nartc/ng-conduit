import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStore } from './local.store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly localStore = inject(LocalStore);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.localStore.getItem('ng-conduit-token');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Token ${token}`,
        },
      });
    }

    return next.handle(req);
  }
}

export function provideAuthInterceptor(): Provider {
  return {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  };
}
