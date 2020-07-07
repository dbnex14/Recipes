import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as fromAuthActions from './store/auth.actions';

// We export is since now we will also use it in AuthComponent, not just here.
export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    //user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    
    constructor(
        private httpClient: HttpClient, 
        private router: Router,
        private store: Store<fromApp.AppState>) {}

    // sends request to signup url https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
    // we get from Firebase
    signup(email: string, password: string) {
        // We dont subscribe here but return this observable so that in authCoponent we can get information about this
        // request or in case of error show error message.  Or we might want to show loading indicator.
        return this.httpClient
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
                {
                    // the email, password and returnSecureToken are requeed by the Firebase Restful Auth API, check
                    // https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
        )
        .pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(resData.email, resData.localId, resData.idToken ,+resData.expiresIn)
            })
        );
    }

    autologin() {
        // auto logs in user when app restarts, like in case user reloads browser
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        }= JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;  // user must login by themselves
        }

        // now create User object out of this userData java-script object
        const loadedUser = new User(
            userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)
        );
        // now we have access to User's methods and properties as well since true User object
        if (loadedUser.token) {
            //this.user.next(loadedUser); // emit new user
            this.store.dispatch(new fromAuthActions.AuthenticateSuccessAction(
                {
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate)
                }
            ));
            // calculate expiration : future date in milliseconds - current date in milliseconds
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autologout(expirationDuration);
        }
    }

    autologout(expirationDurationMS: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDurationMS);
    }

    login(email: string, password: string) {
        // like above, we return this observable here only and subscirbe elsewhere.
        return this.httpClient.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(resData.email, resData.localId, resData.idToken ,+resData.expiresIn)
            })); 
    }

    logout() {
        //this.user.next(null); // emit 
        this.store.dispatch(new fromAuthActions.LogoutAction()); //dispatch reducer action
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer); // clear timer
        }
        this.tokenExpirationTimer = null;  // then reset it to null
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresInMS: number) {
        const expirationDate = new Date(
            new Date().getTime() + expiresInMS * 1000);
        const user = new User(email, userId, token, expirationDate);
        //this.user.next(user);
        this.store.dispatch(new fromAuthActions.AuthenticateSuccessAction(
            {
                email: email,
                userId: userId,
                token: token,
                expirationDate: expirationDate
            }
        ));
        this.autologout(expiresInMS * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
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
        return throwError(errorMessage);
    }
}