import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from './shared/data-access/auth.store';

@Component({
    selector: 'app-root',
    template: '<router-outlet />',
    standalone: true,
    imports: [RouterOutlet],
})
export class App {
    private readonly authStore = inject(AuthStore);

    ngOnInit() {
        this.authStore.init();
    }
}
