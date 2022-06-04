import { Component, inject } from '@angular/core';
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
  private readonly authStore = inject(AuthStore);

  ngOnInit() {
    this.authStore.refresh();
  }
}
