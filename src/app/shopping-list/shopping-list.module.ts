import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild(
            [
                { path: '', component: ShoppingListComponent }
            ])
    ],
    exports: [
        // no longer needed as exported as part of shopping-list-module routes
        // ShoppingListComponent,
        // ShoppingEditComponent 
    ],
    //providers: [LoggingService]
})
export class ShoppingListModule {}