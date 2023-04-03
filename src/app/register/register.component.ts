import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { NewUser } from '../shared/data-access/api';
import { ERRORS_API } from '../shared/data-access/errors/errors-api.di';
import { FormLayout } from '../shared/ui/form-layout/form-layout.component';
import { TypedFormGroup } from '../shared/utils/typed-form';
import { provideRegister, REGISTER } from './register.di';

@Component({
    template: `
        <app-form-layout class="auth-page" innerClass="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign up</h1>
            <p class="text-xs-center">
                <a routerLink="/login">Have an account?</a>
            </p>

            <ng-container *ngIf="registerErrors$ | async as registerErrors">
                <ul class="error-messages" *ngIf="registerErrors.hasError">
                    <li *ngFor="let error of registerErrors.errors">{{ error }}</li>
                </ul>
            </ng-container>

            <form [formGroup]="form" (ngSubmit)="submit()">
                <fieldset class="form-group">
                    <input
                        class="form-control form-control-lg"
                        type="text"
                        placeholder="Username"
                        formControlName="username"
                    />
                </fieldset>
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
                    Sign up
                </button>
            </form>
        </app-form-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FormLayout, RouterLink, AsyncPipe, NgIf, NgFor, ReactiveFormsModule],
    providers: [provideRegister()],
})
export default class Register {
    private readonly register = inject(REGISTER);
    private readonly errorsApi = inject(ERRORS_API);

    readonly registerErrors$ = this.errorsApi.errors$.pipe(tap(console.log));

    readonly form: TypedFormGroup<NewUser> = inject(FormBuilder).nonNullable.group({
        username: ['', [Validators.required]],
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
    });

    submit() {
        this.register(this.form.getRawValue());
    }
}
