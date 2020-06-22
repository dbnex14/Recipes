import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private httpClient: HttpClient,
        private recipeService: RecipeService) {}

    storeRecipes() {
        // Use injected recipeService to get recipes and then use httpClient
        // injected to create http request to post the recipes to Firebase.
        const recipes = this.recipeService.getRecipes();
        // if we wanted to store one recipe, I could definitelly use POST
        // request but I want to store all recipes and also override existing
        // ones if any are already at the back end.
        // For that, we use PUT request
        this.httpClient
            .put(
                'https://ng-course-recipe-book-ca2d1.firebaseio.com/recipes.json',
                recipes
            )
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
        // Note since we are no longer subscribing here, we have to return and
        // subscribe in caller.
        return this.httpClient
            .get<Recipe[]>('https://ng-course-recipe-book-ca2d1.firebaseio.com/recipes.json')
            // Transform data so we handle cases when we have recipe without any
            // ingredients yet so we dont run into situations to try to interact
            // with ingredietns array which is undefined.  Basically, if undefined, 
            // we want an empty array, so we use pipe and map to do transorm.
            .pipe(map(response => {
                // This might be confusing but map here is not same as map above
                // in the pipe.  WE are here mapping an JS array so it is just
                // JS map array function.  Above map is rxjs operator.  JS map takes
                // an annonimous function that is executed for every element in the
                // array and returns transformed array element, in this case recipe.
                return response.map(recipe => {
                    // return original array but if one of its elements does not
                    // have ingredients array, return empty ingredients array.  For that
                    // we use spread (...) operator to return original elements and we 
                    // use ternary operator to check if the element have ingredients array
                    // that is not null or undefined.  If so, we just return it; else we 
                    // return an empty array.
                    return { 
                        ...recipe, 
                        ingredients: recipe.ingredients ? recipe.ingredients : []};
                });
            }))
            .subscribe(response => {
                console.log(response);
                // response is Recipe[] but Angular does not know that, so we use
                // get<Recipe[]> above to transform response we got into Recipe[].  Of
                // course, this means our returned response must be an array of recipes
                // which in this case is the case.
                this.recipeService.setRecipes(response); 
            });
    }
}