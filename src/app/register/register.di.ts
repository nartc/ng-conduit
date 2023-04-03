import { InjectionToken } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { UserAndAuthenticationApiClient } from '../shared/data-access/api';
import { AUTH_AUTHENTICATE } from '../shared/data-access/auth/auth.di';
import { ERRORS_API, provideErrorsApi } from '../shared/data-access/errors/errors-api.di';
import { LocalStorageService } from '../shared/data-access/local-storage.service';
import { registerFactory } from './register.factory';

export const REGISTER = new InjectionToken<ReturnType<typeof registerFactory>>('Register');

export function provideRegister() {
    return [
        provideErrorsApi(),
        {
            provide: REGISTER,
            useFactory: registerFactory,
            deps: [ComponentStore, ERRORS_API, AUTH_AUTHENTICATE, UserAndAuthenticationApiClient, LocalStorageService],
        },
    ];
}
