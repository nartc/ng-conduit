import { Route } from '@angular/router';
import { provideProfileArticlesType } from './articles/articles.di';

export const profileRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./profile.component').then((m) => m.Profile),
    children: [
      {
        path: '',
        providers: [provideProfileArticlesType('my')],
        loadComponent: () =>
          import('./articles/articles.component').then((m) => m.Articles),
      },
      {
        path: 'favorites',
        providers: [provideProfileArticlesType('favorites')],
        loadComponent: () =>
          import('./articles/articles.component').then((m) => m.Articles),
      },
    ],
  },
];
