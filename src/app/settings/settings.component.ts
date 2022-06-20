import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';
import { UpdateUser, User } from '../shared/data-access/api';
import { TypedFormGroup } from '../shared/utils/typed-form';
import { SettingsStore } from './settings.store';

@Component({
  selector: 'app-settings',
  template: `
    <div class="settings-page" *ngIf="vm$ | async as vm">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Your Settings</h1>

            <form [formGroup]="form" (ngSubmit)="submit()">
              <fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    formControlName="image"
                  />
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Your Username"
                    formControlName="username"
                  />
                </fieldset>
                <fieldset class="form-group">
                  <textarea
                    class="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    formControlName="bio"
                  ></textarea>
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
                    formControlName="token"
                  />
                </fieldset>
                <button
                  type="submit"
                  class="btn btn-lg btn-primary pull-xs-right"
                  [disabled]="form.invalid"
                >
                  Update Settings
                </button>
              </fieldset>
            </form>

            <hr />

            <button class="btn btn-outline-danger" (click)="logout()">
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [provideComponentStore(SettingsStore)],
  imports: [CommonModule, ReactiveFormsModule],
})
export class Settings {
  constructor(private fb: FormBuilder, private store: SettingsStore) {}

  readonly form: TypedFormGroup<UpdateUser> = this.fb.nonNullable.group({});
  readonly vm$ = this.store.vm$.pipe(
    tap((currentUser) => {
      if (currentUser && !this.isFormInitialized) {
        this.initForm(currentUser);
      }
    })
  );

  private isFormInitialized = false;

  private initForm(currentUser: User) {
    this.form.addControl('image', this.fb.control(currentUser.image || ''));
    this.form.addControl(
      'username',
      this.fb.control(currentUser.username, [Validators.required])
    );
    this.form.addControl('bio', this.fb.control(currentUser.bio || ''));
    this.form.addControl(
      'email',
      this.fb.control(currentUser.email, [
        Validators.required,
        Validators.email,
      ])
    );
    this.form.addControl('token', this.fb.control(''));
    this.isFormInitialized = true;
  }

  submit() {
    this.store.updateSettings(this.form.getRawValue());
  }

  logout() {
    this.store.logout();
  }
}
