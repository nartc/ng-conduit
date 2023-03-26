import { Component } from '@angular/core';

@Component({
    selector: 'app-auth-layout',
    template: `
        <div class="auth-page">
            <div class="container page">
                <div class="row">
                    <div class="col-md-6 offset-md-3 col-xs-12">
                        <ng-content />
                    </div>
                </div>
            </div>
        </div>
    `,
    standalone: true,
})
export class AuthLayout {}
