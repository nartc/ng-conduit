import { HttpClientModule } from '@angular/common/http';
import { Component, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { API_BASE_URL } from './shared/data-access/api';
import { provideAuthInterceptor } from './shared/data-access/auth.interceptor';
import { AuthStore } from './shared/data-access/auth.store';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  standalone: true,
  imports: [RouterModule],
})
export class App {
  constructor(private authStore: AuthStore) {}

  ngOnInit() {
    this.authStore.init();
  }

  static bootstrap() {
    bootstrapApplication(this, {
      providers: [
        { provide: API_BASE_URL, useValue: environment.apiUrl },
        importProvidersFrom(
          RouterModule.forRoot(
            [
              {
                path: '',
                loadComponent: () =>
                  import('./layout/layout.component').then((m) => m.Layout),
                loadChildren: () =>
                  import('./layout/layout.routes').then((m) => m.routes),
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
  }
}
