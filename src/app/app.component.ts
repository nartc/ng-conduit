import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AUTH_INIT } from './shared/data-access/auth/auth.di';

@Component({
    selector: 'app-root',
    template: '<router-outlet />',
    standalone: true,
    imports: [RouterOutlet],
})
export class App {
    private readonly initAuth = inject(AUTH_INIT);

    ngOnInit() {
        this.initAuth();
    }
}
