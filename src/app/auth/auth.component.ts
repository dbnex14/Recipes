import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthService, AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import * as fromAuthActions from '../auth/store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{
    isLoginMode = true;
    isLoading = false; // flag when form should show, same for spinner
    error: string = null;
    @ViewChild(PlaceHolderDirective, { static: false } ) alertHost: PlaceHolderDirective;
    private closeSubscription: Subscription;

    constructor(
        private authService: AuthService, 
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>) {}

    ngOnDestroy(): void {
        if (this.closeSubscription) {
            this.closeSubscription.unsubscribe();
        }
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<AuthResponseData>;

        this.isLoading = true;

        if (this.isLoginMode) {
            //authObs = this.authService.login(email, password);
            this.store.dispatch(
                new fromAuthActions.LoginStartAction({ email: email, password: password })
              );
        } else {
            authObs = this.authService.signup(email, password);
        }

        authObs.subscribe(
            resData => {
                console.log(resData);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.showErrorAlert(errorMessage);
                this.isLoading = false;
            }
        );

        form.reset();
    }

    onHandleError(){
        this.error = null;
    }

    private showErrorAlert(message: string) {
        // Here we want to dynamically create a component and we cannot just 
        // new AlertComponent as that is just a valid JS object but not a valid 
        // Angular component object.  Instead, we need to inject Angular tool
        // that helps us create componets called ComponentFactoryResolver and use that.
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        // our alertHost is our PlaceHolderDirective we are accessing in our template
        // through @ViewChild and it exposes public property viewContainerRef which is
        // of type ViewContainerRef
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        // clean all that might have been rendered before, before we render something new
        hostViewContainerRef.clear();
        // now we use coponent factory and our host view container reference to craete
        // new component, we dont need to provide it type but the factory.
        const alertComponentReference = hostViewContainerRef.createComponent(componentFactory);
        alertComponentReference.instance.message = message;
        this.closeSubscription = alertComponentReference.instance.close.subscribe(() => {
            this.closeSubscription.unsubscribe();
            hostViewContainerRef.clear();
        });
    }
}