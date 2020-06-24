import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';
import { takeLast } from 'rxjs/operators';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false; // flag when form should show, same for spinner
    error: string = null;

    constructor(private authService: AuthService) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.value) {
            return;
        }

        console.log(form.value);
        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;  
        if (this.isLoginMode) {
            //...
        } else {
            this.authService.signup(email, password)
                .subscribe(response => {  // arrow function to precess response
                    console.log(response);
                    this.isLoading = false;
                },
                errorMessage => { // arrow function to handle error
                    console.log(errorMessage);
                    this.error = errorMessage;
                    this.isLoading = false;
                }
            );
        }

        form.reset();
    }
}