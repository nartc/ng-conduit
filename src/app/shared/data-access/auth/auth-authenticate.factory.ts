import { Router } from '@angular/router';
import { refreshFactory } from './auth-init.factory';

export function authAuthenticateFactory(refresh: ReturnType<typeof refreshFactory>, router: Router) {
    return (urlSegments: string[] = ['/']) => {
        refresh();
        void router.navigate(urlSegments);
    };
}

export type AuthAuthenticateApi = ReturnType<typeof authAuthenticateFactory>;
