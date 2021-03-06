import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate {
    constructor(
        private authService: AuthService, 
        private router: Router,
        private store: Store<fromApp.AppState>) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
        boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // we dont subscribe to user since that is already an observable but we jusst return
        // it but we need to return boolean, so we use pipe and map to check if user exists.
        // Now we can use this guard in front of routes we want to protect.
        //return this.authService.user.pipe(
        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                return authState.user;
            }),
            map(user => {
                const isAuth = !!user;
                if (isAuth) {
                    return true;
                }
                return this.router.createUrlTree(['/auth']);  // if false redirect
            })
            // old way
            // tap(isAuth => {
            //     if (!isAuth) {
            //         this.router.navigate(['/auth']);
            //     }
            // })
        );
    }
}