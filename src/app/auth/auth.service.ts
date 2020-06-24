import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    constructor(private httpClient: HttpClient) {}

    // sends request to signup url https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
    // we get from Firebase
    signup(email: string, password: string) {
        // We dont subscribe here but return this observable so that in authCoponent we can get information about this
        // request or in case of error show error message.  Or we might want to show loading indicator.
        return this.httpClient
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCtuGW4uSwIHoFWKtxY9SPr1RFhPS_r4yg',
                {
                    // the email, password and returnSecureToken are requeed by the Firebase Restful Auth API, check
                    // https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
            )
            .pipe(catchError(errorResponse => {
                let errorMessage = 'An error occured!';
                if (!errorResponse.error || !errorResponse.error.error) {
                    // wrap message into observable and return
                    return throwError(errorMessage);
                }
                switch(errorResponse.error.error.message) {
                    case 'EMAIL_EXISTS':
                        errorMessage = 'This email exists already.';
                        break;
                }
                return throwError(errorMessage);
            }));
    }
}