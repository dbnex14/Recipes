import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' }, // if user does not provide route, redirect to recipes
    { path: 'recipes', component: RecipesComponent }, //domain/recipes
    { path: 'shopping-list', component: ShoppingListComponent }, // domain/shoppinglist
];

// make it Angular module class by @NgModule
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    // since we are here in another module, we need to export our
    // configured router into our main or app.module so it is available
    // there for Angular since we are here in our own module we added.
    // Then we need to omport this module in app.module imports array.
    exports: [RouterModule]
})
export class AppRoutingModule {

}