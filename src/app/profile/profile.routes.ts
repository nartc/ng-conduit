import { Route } from '@angular/router';

export const profileRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./profile.component').then((m) => m.Profile),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./my-articles/my-articles.component').then(
            (m) => m.MyArticles
          ),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./favorites-articles/favorites-articles.component').then(
            (m) => m.FavoritesArticles
          ),
      },
    ],
  },
];
