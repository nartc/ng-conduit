import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from '../shared/data-access/auth.store';
import { Footer } from './ui/footer/footer.component';
import { Header } from './ui/header/header.component';

@Component({
  template: `
    <ng-container *ngIf="auth$ | async as auth">
      <app-header
        [isAuthenticated]="auth.isAuthenticated"
        [username]="auth.user?.username"
      />
      <router-outlet />
      <app-footer />
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [Header, Footer, RouterOutlet, NgIf, AsyncPipe],
})
export default class Layout {
  readonly auth$ = inject(AuthStore).auth$;
}
