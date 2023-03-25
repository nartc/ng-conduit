import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { environment } from '../environments/environment';
import { API_BASE_URL } from './shared/data-access/api';
import { authInterceptor } from './shared/data-access/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    provideRouter(
      [
        {
          path: '',
          loadComponent: () => import('./layout/layout.component'),
          loadChildren: () => import('./layout/layout.routes'),
        },
      ],
      withHashLocation()
    ),
    provideHttpClient(withInterceptors([authInterceptor()])),
  ],
};
