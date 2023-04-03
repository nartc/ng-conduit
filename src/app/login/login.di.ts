import { InjectionToken } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { UserAndAuthenticationApiClient } from '../shared/data-access/api';
import { AUTH_AUTHENTICATE } from '../shared/data-access/auth/auth.di';
import { ERRORS_API, provideErrorsApi } from '../shared/data-access/errors/errors-api.di';
import { LocalStorageService } from '../shared/data-access/local-storage.service';
import { loginFactory } from './login.factory';

export const LOGIN = new InjectionToken<ReturnType<typeof loginFactory>>('Login');

export function provideLogin() {
    return [
        provideErrorsApi(),
        {
            provide: LOGIN,
            useFactory: loginFactory,
            deps: [ComponentStore, UserAndAuthenticationApiClient, LocalStorageService, AUTH_AUTHENTICATE, ERRORS_API],
        },
    ];
}
