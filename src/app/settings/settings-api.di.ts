import { InjectionToken } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { UserAndAuthenticationApiClient } from '../shared/data-access/api';
import { AUTH_AUTHENTICATE, AUTH_STORE } from '../shared/data-access/auth/auth.di';
import { LocalStorageService } from '../shared/data-access/local-storage.service';
import { settingsApiFactory, updateSettingsFactory } from './settings-api.factory';

const UPDATE_SETTINGS = new InjectionToken<ReturnType<typeof updateSettingsFactory>>('Settings API update settings');
export const SETTINGS_API = new InjectionToken<ReturnType<typeof settingsApiFactory>>('Settings API');

export function provideSettingsApi() {
    return [
        ComponentStore,
        {
            provide: UPDATE_SETTINGS,
            useFactory: updateSettingsFactory,
            deps: [ComponentStore, AUTH_AUTHENTICATE, UserAndAuthenticationApiClient],
        },
        {
            provide: SETTINGS_API,
            useFactory: settingsApiFactory,
            deps: [UPDATE_SETTINGS, AUTH_AUTHENTICATE, AUTH_STORE, LocalStorageService],
        },
    ];
}
