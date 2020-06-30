import { NgModule } from '@angular/core';

import { RecipesComponent } from './recipes.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesRoutingModue } from './recipes-routing.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        RecipesComponent,
        RecipeListComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        RecipeEditComponent
    ],
    imports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        RecipesRoutingModue,
        SharedModule
    ],
    // exports: [
    //     // Now that we manage loading of our components in RecipesRouting, through 
    //     // the route onfiguration, there is no need to still export these components 
    //     // here, so we remove them from there.
    //     // RecipesComponent,
    //     // RecipeListComponent,
    //     // RecipeDetailComponent,
    //     // RecipeItemComponent,
    //     // RecipeStartComponent,
    //     // RecipeEditComponent
    // ]
})
export class RecipesModule {

}