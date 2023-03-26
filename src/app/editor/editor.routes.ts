import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('./new-article.component'),
    },
    {
        path: ':slug',
        loadComponent: () => import('./edit-article/edit-article.component'),
    },
] as Routes;
