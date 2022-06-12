import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from './shared/data-access/auth.store';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  standalone: true,
  imports: [RouterModule],
})
export class App {
  constructor(private authStore: AuthStore) {}

  ngOnInit() {
    this.authStore.init();
  }
}
