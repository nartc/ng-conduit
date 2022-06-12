import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../shared/data-access/auth.store';
import { Footer } from './ui/footer/footer.component';
import { Header } from './ui/header/header.component';

@Component({
  selector: 'app-layout',
  template: `
    <ng-container *ngIf="auth$ | async as auth">
      <app-header
        [isAuthenticated]="auth.isAuthenticated"
        [username]="auth.user?.username"
      ></app-header>
      <router-outlet></router-outlet>
      <app-footer></app-footer>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [Header, Footer, RouterModule, CommonModule],
})
export class Layout {
  constructor(private authStore: AuthStore) {}

  readonly auth$ = this.authStore.auth$;
}
