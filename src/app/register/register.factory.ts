import { HttpErrorResponse } from '@angular/common/http';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap } from 'rxjs';
import { NewUser, UserAndAuthenticationApiClient } from '../shared/data-access/api';
import { AuthAuthenticateApi } from '../shared/data-access/auth/auth-authenticate.factory';
import { ErrorsApi } from '../shared/data-access/errors/errors-api.factory';
import { LocalStorageService } from '../shared/data-access/local-storage.service';

export function registerFactory(
    store: ComponentStore<{}>,
    errorsApi: ErrorsApi,
    authAuthenticate: AuthAuthenticateApi,
    userAndAuthenticationApiClient: UserAndAuthenticationApiClient,
    localStorageService: LocalStorageService
) {
    return store.effect<NewUser>(
        exhaustMap((newUser) => {
            return userAndAuthenticationApiClient.createUser({ body: { user: newUser } }).pipe(
                tapResponse(
                    (response) => {
                        localStorageService.setItem('ng-conduit-token', response.user.token);
                        localStorageService.setItem('ng-conduit-user', response.user);
                        authAuthenticate();
                    },
                    (error: HttpErrorResponse) => {
                        console.error('error registering new user: ', error);
                        if (error.error.errors) {
                            errorsApi.updateErrors(error.error.errors);
                        }
                    }
                )
            );
        })
    );
}
