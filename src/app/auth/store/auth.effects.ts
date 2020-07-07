import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import * as fromAuthActions from './auth.actions';
import { environment } from '../../../environments/environment';


export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (
    expiresIn: number, 
    email: string, 
    userId: string, 
    token: string) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    return new fromAuthActions.AuthenticateSuccessAction({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate
    });
};

const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      //NEVER throwError from Effect, taht makes obserbable stream die
      return of(new fromAuthActions.AuthenticateFailAction(errorMessage));
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return of(new fromAuthActions.AuthenticateFailAction(errorMessage));
};

@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(fromAuthActions.SIGNUP_START),
        switchMap((signupAction: fromAuthActions.SignupStartAction) => {
            return this.httpClient.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' 
                    + environment.firebaseAPIKey,
                {
                    // the email, password and returnSecureToken are requeed by the Firebase Restful Auth API, check
                    // https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }
            )
            .pipe(
                map(resData => {
                    return handleAuthentication(
                        +resData.expiresIn, 
                        resData.expiresIn, 
                        resData.localId, 
                        resData.idToken);
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    );

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
            )
            .pipe(
                map(resData => {
                    return handleAuthentication(
                        +resData.expiresIn, 
                        resData.expiresIn, 
                        resData.localId, 
                        resData.idToken);
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    );

    @Effect({dispatch: false})
    authRedirect = this.actions$.pipe(
        ofType(fromAuthActions.AUTHENTICATE_SUCCESS, fromAuthActions.LOGOUT),
        tap(() => {
            this.router.navigate(['/']);
        })
    );

    constructor(
        private actions$: Actions, 
        private httpClient: HttpClient, 
        private router: Router) {}
}