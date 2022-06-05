import { Route } from '@angular/router';

export const profileRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./profile.component').then((m) => m.Profile),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./favorites/favorites.component').then((m) => m.Favorites),
  },
];
