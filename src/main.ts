import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { App } from './app/app.component';
import { API_BASE_URL } from './app/shared/data-access/api';
import { provideAuthInterceptor } from './app/shared/data-access/auth.interceptor';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(App, {
  providers: [
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    importProvidersFrom(
      RouterModule.forRoot(
        [
          {
            path: '',
            loadComponent: () =>
              import('./app/layout/layout.component').then((m) => m.Layout),
            loadChildren: () =>
              import('./app/layout/layout.routes').then((m) => m.routes),
          },
        ],
        {
          useHash: true,
        }
      ),
      HttpClientModule
    ),
    provideAuthInterceptor(),
  ],
}).catch((err) => console.error(err));
