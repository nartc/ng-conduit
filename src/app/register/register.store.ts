import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { exhaustMap } from 'rxjs';
import { NewUser, UserAndAuthenticationApiClient } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { LocalStorageService } from '../shared/data-access/local-storage.service';
import { processAuthErrors } from '../shared/utils/process-auth-errors';

export interface RegisterState {
    errors: Record<string, string[]>;
}

export const initialRegisterState: RegisterState = {
    errors: {},
};

@Injectable()
export class RegisterStore extends ComponentStore<RegisterState> implements OnStoreInit {
    private readonly userAndAuthenticationClient = inject(UserAndAuthenticationApiClient);
    private readonly localStorageService = inject(LocalStorageService);
    private readonly authStore = inject(AuthStore);

    readonly errors$ = this.select((s) => s.errors);

    readonly registerErrors$ = this.select(this.errors$, processAuthErrors, {
        debounce: true,
    });

    ngrxOnStoreInit() {
        this.setState(initialRegisterState);
    }

    readonly register = this.effect<NewUser>(
        exhaustMap((newUser) => {
            return this.userAndAuthenticationClient.createUser({ body: { user: newUser } }).pipe(
                tapResponse(
                    (response) => {
                        this.localStorageService.setItem('ng-conduit-token', response.user.token);
                        this.localStorageService.setItem('ng-conduit-user', response.user);
                        this.authStore.authenticate();
                    },
                    (error: { errors: Record<string, string[]> }) => {
                        console.error('error registering new user: ', error);
                        if (error.errors) {
                            this.patchState({ errors: error.errors });
                        }
                    }
                )
            );
        })
    );
}
