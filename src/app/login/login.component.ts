import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginUser } from '../shared/data-access/api';
import { ERRORS_API } from '../shared/data-access/errors/errors-api.di';
import { FormLayout } from '../shared/ui/form-layout/form-layout.component';
import { TypedFormGroup } from '../shared/utils/typed-form';
import { LOGIN, provideLogin } from './login.di';

@Component({
    template: `
        <app-form-layout class="auth-page" innerClass="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign in</h1>
            <p class="text-xs-center">
                <a routerLink="/register">Need an account?</a>
            </p>

            <ng-container *ngIf="loginErrors$ | async as loginErrors">
                <ul class="error-messages" *ngIf="loginErrors.hasError">
                    <li *ngFor="let error of loginErrors.errors">{{ error }}</li>
                </ul>
            </ng-container>

            <form [formGroup]="form" (ngSubmit)="submit()">
                <fieldset class="form-group">
                    <input
                        class="form-control form-control-lg"
                        type="text"
                        placeholder="Email"
                        formControlName="email"
                    />
                </fieldset>
                <fieldset class="form-group">
                    <input
                        class="form-control form-control-lg"
                        type="password"
                        placeholder="Password"
                        formControlName="password"
                    />
                </fieldset>
                <button type="submit" class="btn btn-lg btn-primary pull-xs-right" [disabled]="form.invalid">
                    Sign in
                </button>
            </form>
        </app-form-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FormLayout, NgIf, RouterLink, NgFor, AsyncPipe, ReactiveFormsModule],
    providers: [provideLogin()],
})
export default class Login {
    private readonly login = inject(LOGIN);
    private readonly errorsApi = inject(ERRORS_API);

    readonly loginErrors$ = this.errorsApi.errors$;

    readonly form: TypedFormGroup<LoginUser> = inject(FormBuilder).nonNullable.group({
        email: ['', [Validators.email]],
        password: [''],
    });

    submit() {
        this.login(this.form.getRawValue());
    }
}
