import { Route } from '@angular/router';
import { AuthGuard } from '../shared/data-access/auth.guard';
import { NonAuthGuard } from '../shared/data-access/non-auth.guard';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('../home/home.component').then((m) => m.Home),
  },
  {
    path: 'login',
    canActivate: [NonAuthGuard],
    canLoad: [NonAuthGuard],
    loadComponent: () =>
      import('../login/login.component').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [NonAuthGuard],
    canLoad: [NonAuthGuard],
    loadComponent: () =>
      import('../register/register.component').then((m) => m.Register),
  },
  {
    path: 'editor',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('../editor/editor.routes').then((m) => m.editorRoutes),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadComponent: () =>
      import('../settings/settings.component').then((m) => m.Settings),
  },
  {
    path: 'article/:slug',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadComponent: () =>
      import('../article/article.component').then((m) => m.Article),
  },
  {
    path: 'profile/:username',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('../profile/profile.routes').then((m) => m.profileRoutes),
  },
];
