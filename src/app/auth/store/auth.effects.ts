import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as fromAuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

export class AuthEffects {
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(fromAuthActions.LOGIN_START),
        switchMap((authData: fromAuthActions.LoginStartAction) => {
            return this.httpClient.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                catchError(error => {
                    ///... error handling code
                    of();
                }), map(resData => {
                    of();
                })
            );
        }),

    );

    constructor(private actions$: Actions, private httpClient: HttpClient) {}
}