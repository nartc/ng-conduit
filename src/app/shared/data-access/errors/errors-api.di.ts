import { InjectionToken } from '@angular/core';
import { ComponentStore, INITIAL_STATE_TOKEN } from '@ngrx/component-store';
import { ErrorsApi, errorsApiFactory } from './errors-api.factory';

export const ERRORS_API = new InjectionToken<ErrorsApi>('Form Errors API');

export function provideErrorsApi() {
    return [
        ComponentStore,
        { provide: INITIAL_STATE_TOKEN, useValue: { errors: {} } },
        {
            provide: ERRORS_API,
            useFactory: errorsApiFactory,
            deps: [ComponentStore],
        },
    ];
}
