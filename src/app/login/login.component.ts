import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { LoginUser } from '../shared/data-access/api';
import { AuthLayout } from '../shared/ui/auth-layout/auth-layout.component';
import { TypedFormGroup } from '../shared/utils/typed-form';
import { LoginStore } from './login.store';

@Component({
    template: `
        <app-auth-layout>
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
        </app-auth-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [AuthLayout, NgIf, RouterLink, NgFor, AsyncPipe, ReactiveFormsModule],
    providers: [provideComponentStore(LoginStore)],
})
export default class Login {
    private readonly store = inject(LoginStore);

    readonly loginErrors$ = this.store.loginErrors$;

    readonly form: TypedFormGroup<LoginUser> = inject(FormBuilder).nonNullable.group({
        email: ['', [Validators.email]],
        password: [''],
    });

    submit() {
        this.store.login(this.form.getRawValue());
    }
}
