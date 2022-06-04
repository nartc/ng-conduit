import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('../home/home.component').then((m) => m.Home),
  },
];
