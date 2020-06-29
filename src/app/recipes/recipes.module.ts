import { NgModule } from '@angular/core';

import { RecipesComponent } from './recipes.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesRoutingModue } from './recipes-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

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
        ReactiveFormsModule,
        RecipesRoutingModue
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