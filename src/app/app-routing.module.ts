import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    // we add this route back to support Lazy Loading of Recipes route using an
    // older syntax with #ModuleName but in newer versions of Angular, this syntax
    // could even fail so we provide it here as commented out and it is working fine
    // in Angular 9 but below we provide newer syntax using annonymous functions and
    // then promisse.
    //{ path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule' }
    // Here is same as above but using new syntax with anonymous arrow function and then
    // promisse.  The anonymous function below calls import() to which we pass the path 
    // to the module to load, in our case recipes.module.  And we dont use # then to 
    // id the module but instead import results promise then to which we pass 
    // another anonymous function that receives module we loaded with iport() call 
    // and on it we extract our RecipesModule.
    { 
        path: 'recipes', 
        loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) 
    }
    // moved into recipes-routing.module
    // { 
    //     path: 'recipes', 
    //     component: RecipesComponent, 
    //     canActivate: [AuthGuardService],
    //     children: [
    //         { path: '', component: RecipeStartComponent },
    //         { path: 'new', component: RecipeEditComponent }, // this must be before one with :id below
    //         // below two routes need id so we add resolver to them to make sure that
    //         // the recipe with id is loaded  indeed to avoid errors 
    //         // if user is on it and hits refresh
    //         { path: ':id', component: RecipeDetailComponent, resolve: [RecipeResolverService] },
    //         { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipeResolverService]  },
    //     ]
    // }, //domain/recipes
    // moved into shopping-list-routing.module
    //{ path: 'shopping-list', component: ShoppingListComponent }, // domain/shoppinglist
    // moved to AuthModule imports
    //{ path: 'auth', component: AuthComponent }
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