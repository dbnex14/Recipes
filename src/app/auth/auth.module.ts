import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [AuthComponent],
    // We need these 2, 1st for ngIf, ngFor etc, 2nd since we use Template Driven approach
    // in AuthModule.  We also move 'auth' path here.  And we need SharedMOdule as
    // LoadingSpinnerComponnet is used by AuthComponent but it is defined in SharedModule
    imports: [
        CommonModule, 
        FormsModule,
        RouterModule.forChild([{ path: 'auth', component: AuthComponent }]),
        SharedModule
    ],
    exports: []
})
export class AuthModule {}