import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Observable } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe[]> {
    constructor(private dataStorageService: DataStorageService, 
        private recipeService: RecipeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
        Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
       // I want to load all recipes so return either array or recipes which we
        // cant since we have to load it first from Firebase backend
        // or an observable that will in the
        // end yield an array of Recipes and that is something we can offer since
        // if we look in our data storage service where we have fetchRecipes() in
        // which we subscribe() to get() http method so we just have to tweak this
        // little bit.  We need to remove subscribe() from there
        // and return result of get request (so observable) and then we can call
        // fetchRecipes().  From here, this resolver will automatically subscribe
        // for us so we dont need to subscribe here.  Resolver will subscribe for 
        // me to get me data once it is available.
        // Final step is to apply resolver in our app-routing to the 2 paths that
        // rely on recipe being loaded, so the one needing recipe id.
        // So, we will guard on routes requiring recipe detail such as /recipes/2
        // and in the case data is not loaded, this resolver will fetch the data 
        // for us and provide it to us.
        // However, if we edit an recipe, like for example its title and hit Save
        // button (not Save Data which saves to backend), our change will be 
        // overwriten by this resolver since it kicks in and gets backed data each
        // time we work on route that requires recipe id (which is edit or recipe
        // detail route).  For that reason, we inject recipe service and use it to
        // if we have recipes in recipe service and only fetch them if we dont.
        // Otherwise, just return recipes from recipe service.
        const recipes = this.recipeService.getRecipes();
        if (recipes.length === 0) {
            return this.dataStorageService.fetchRecipes();
        } else {
            return recipes;
        }
        
    }
}