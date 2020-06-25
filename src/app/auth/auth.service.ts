import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

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
    user = new BehaviorSubject<User>(null);
    
    constructor(private httpClient: HttpClient, private router: Router) {}

    // sends request to signup url https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
    // we get from Firebase
    signup(email: string, password: string) {
        // We dont subscribe here but return this observable so that in authCoponent we can get information about this
        // request or in case of error show error message.  Or we might want to show loading indicator.
        return this.httpClient
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCtuGW4uSwIHoFWKtxY9SPr1RFhPS_r4yg',
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
            this.user.next(loadedUser); // emit new user
        }
    }

    login(email: string, password: string) {
        // like above, we return this observable here only and subscirbe elsewhere.
        return this.httpClient.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCtuGW4uSwIHoFWKtxY9SPr1RFhPS_r4yg',
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
        this.user.next(null);
        this.router.navigate(['/auth']);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
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