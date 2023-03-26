import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

export function authInterceptor(): HttpInterceptorFn {
    return (req, next) => {
        const token = inject(LocalStorageService).getItem('ng-conduit-token');

        if (token) {
            req = req.clone({ setHeaders: { Authorization: `Token ${token}` } });
        }

        return next(req);
    };
}
