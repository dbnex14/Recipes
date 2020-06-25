import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.user.pipe(
            take(1),
            exhaustMap(user => {
                if (!user) {
                    // when you try to login, you will not have user
                    return next.handle(req);
                }
                //.. edit request here
                const modifiedRequest = req.clone(
                    {
                        params: new HttpParams().set('auth', user.token)
                    }
                );
                return next.handle(modifiedRequest);
            })
        ); 
    }
}