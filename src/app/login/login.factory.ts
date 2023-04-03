import { HttpErrorResponse } from '@angular/common/http';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap } from 'rxjs';
import { LoginUser, UserAndAuthenticationApiClient } from '../shared/data-access/api';
import { AuthAuthenticateApi } from '../shared/data-access/auth/auth-authenticate.factory';
import { ErrorsApi } from '../shared/data-access/errors/errors-api.factory';
import { LocalStorageService } from '../shared/data-access/local-storage.service';

export function loginFactory(
    store: ComponentStore<{}>,
    userAndAuthenticationApiClient: UserAndAuthenticationApiClient,
    localStorageService: LocalStorageService,
    authAuthenticate: AuthAuthenticateApi,
    errorsApi: ErrorsApi
) {
    return store.effect<LoginUser>(
        exhaustMap((loginUser) =>
            userAndAuthenticationApiClient.login({ body: { user: loginUser } }).pipe(
                tapResponse(
                    (response) => {
                        localStorageService.setItem('ng-conduit-token', response.user.token);
                        localStorageService.setItem('ng-conduit-user', response.user);
                        authAuthenticate();
                    },
                    (error: HttpErrorResponse) => {
                        console.error('error login user: ', error);
                        if (error.error.errors) {
                            errorsApi.updateErrors(error.error.errors);
                        }
                    }
                )
            )
        )
    );
}
