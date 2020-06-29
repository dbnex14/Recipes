import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild(
            [
                { path: 'shopping-list', component: ShoppingListComponent }
            ])
    ],
    exports: [
        // no longer needed as exported as part of shopping-list-module routes
        // ShoppingListComponent,
        // ShoppingEditComponent 
    ]
})
export class ShoppingListModule {

}