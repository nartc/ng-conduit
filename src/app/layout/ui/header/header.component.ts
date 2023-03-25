import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  template: `
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" routerLink="/">conduit</a>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <a
              class="nav-link"
              routerLink="/"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              Home
            </a>
          </li>
          <ng-container *ngIf="isAuthenticated; else nonAuthenticated">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/editor"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                <i class="ion-compose"></i>
                &nbsp;New Article
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/settings"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                <i class="ion-gear-a"></i>
                &nbsp;Settings
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                [routerLink]="['/profile', username]"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                {{ username }}
              </a>
            </li>
          </ng-container>
          <ng-template #nonAuthenticated>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/login"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                Sign in
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/register"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                Sign up
              </a>
            </li>
          </ng-template>
        </ul>
      </div>
    </nav>
  `,
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
})
export class Header {
  @Input() isAuthenticated = false;
  @Input() username?: string;
}
