import { Route } from '@angular/router';

export const editorRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./new-article.component').then((m) => m.NewArticle),
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./edit-article/edit-article.component').then(
        (m) => m.EditArticle
      ),
  },
];
