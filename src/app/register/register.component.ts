import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { NewUser } from '../shared/data-access/api';
import { FormLayout } from '../shared/ui/form-layout/form-layout.component';
import { TypedFormGroup } from '../shared/utils/typed-form';
import { RegisterStore } from './register.store';

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
    providers: [provideComponentStore(RegisterStore)],
})
export default class Register {
    private readonly store = inject(RegisterStore);

    readonly registerErrors$ = this.store.registerErrors$;

    readonly form: TypedFormGroup<NewUser> = inject(FormBuilder).nonNullable.group({
        username: ['', [Validators.required]],
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
    });

    submit() {
        this.store.register(this.form.getRawValue());
    }
}
