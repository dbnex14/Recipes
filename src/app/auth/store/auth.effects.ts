import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as fromAuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()
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
                map(resData => {
                    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);

                    return of(new fromAuthActions.LoginAction({
                        email: resData.email,
                        userId: resData.localId,
                        token: resData.idToken,
                        expirationDate: expirationDate
                    }));
                }),
                catchError(error => {
                    ///... error handling code
                    return of();
                })
            );
        }),

    );

    constructor(private actions$: Actions, private httpClient: HttpClient) {}
}