import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private httpClient: HttpClient
        , private recipeService: RecipeService
        , private authService: AuthService) {}

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
            .pipe(map(recipes => {
                // This might be confusing but map here is not same as map above
                // in the pipe.  WE are here mapping an JS array so it is just
                // JS map array function.  Above map is rxjs operator.  JS map takes
                // an annonimous function that is executed for every element in the
                // array and returns transformed array element, in this case recipe.
                return recipes.map(recipe => {
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
            }),
            // The rxjs tap operator allows us to execute some code here without
            // altering the data that is funneled through the response.  So, here
            // indeed we will get recipes array so we just call setRecipes() from
            // here instead of from subscribe below.  So, we now can remove 
            // the subscribe() call below.
            tap(recipes => {
                // so we access the data in response as we still want to set the
                // recipes here in recipes service but we dont want to subscribe
                // here as we want our RecipeResolverService to do that for us so
                // we can guard the routes and prevent error when we say refresh
                // on recipe detail page without first loading recipes from the 
                // Firebase backend.
                this.recipeService.setRecipes(recipes);
            })
        )

        // Get user value from BehaviorSubject user in AuthService.  We use rxjs take() function
        // which we pass 1 to tell rxjs we want to take a value from this observable only once and
        // then automatically unsubscribe from it.  So, I dont want to get future updates on this 
        // 'user' BehaviorSubject, I just want to get them on demand when this method is called.
        // So, we get the user in subscribe() method only once and we dont need to manually 
        // unsubscribe since take() will do that for us automatically.
        // The probem we run into with the previous commented out code below is now that we end up
        // with 2 observables, 1st one getting the user, then the http get() call which we need to
        // return since we subscribe to it in the caller.  If we subscribe() chain on take(), we 
        // could pass in the get() all but then we have observable wrapped inside another observable
        // and we need to return the wrapped one which is the get.  But we cannot return from an
        // observable returned by subscribe().  To solve that, we pass another observable using
        // exhaustMap which waits on 1st observable to complete, which happens when take(1) completes
        // and then replaces it with the observable passed into its arrow function which is now our
        // get() and it returns its observable.  So it got user, replaced its observable with get
        // and returned get() obserbable so we can now return it just like before.
        // And since we use pipe() at the top of this oberbable chain, we can just add the map() as
        // its next step to map the response into the structure we expect to see which is array of
        // recipes with its ingredients array inside.  Bottom line is that at the end, the returned
        // observable will be the http get() obserbable because we switched it with exhaustMap().
        // NOTE! We moved this into interceptor auth-interceptor.service.ts so we no longer need to
        // add it to all outgoing requests, so all changes below can be reverted back to what they 
        // were.
        // return this.authService.user.pipe(
        //     take(1) // get 1-time user observable, unsubscribe from it, then...
        //     , exhaustMap(user => {  // ... replace it with the get observable
        //         return this.httpClient
        //             .get<Recipe[]>(
        //                 'https://ng-course-recipe-book-ca2d1.firebaseio.com/recipes.json',
        //                 {
        //                     params: new HttpParams().set('auth', user.token)
        //                 }
        //             )
        //     })
        //     , map(recipes => {
        //         return recipes.map(recipe => {
        //             return {
        //                 ...recipe,
        //                 ingredients: recipe.ingredients ? recipe.ingredients : []
        //             };
        //         }
        //     )})
        //     , tap(recipes => {
        //         this.recipeService.setRecipes(recipes);
        //     })
        // );
    }

        // // Note since we are no longer subscribing here, we have to return and
        // // subscribe in caller.
        // return this.httpClient
        //     .get<Recipe[]>('https://ng-course-recipe-book-ca2d1.firebaseio.com/recipes.json')
        //     // Transform data so we handle cases when we have recipe without any
        //     // ingredients yet so we dont run into situations to try to interact
        //     // with ingredietns array which is undefined.  Basically, if undefined, 
        //     // we want an empty array, so we use pipe and map to do transorm.
        //     .pipe(map(response => {
        //         // This might be confusing but map here is not same as map above
        //         // in the pipe.  WE are here mapping an JS array so it is just
        //         // JS map array function.  Above map is rxjs operator.  JS map takes
        //         // an annonimous function that is executed for every element in the
        //         // array and returns transformed array element, in this case recipe.
        //         return response.map(recipe => {
        //             // return original array but if one of its elements does not
        //             // have ingredients array, return empty ingredients array.  For that
        //             // we use spread (...) operator to return original elements and we 
        //             // use ternary operator to check if the element have ingredients array
        //             // that is not null or undefined.  If so, we just return it; else we 
        //             // return an empty array.
        //             return { 
        //                 ...recipe, 
        //                 ingredients: recipe.ingredients ? recipe.ingredients : []};
        //         });
        //     }),
        //     // The rxjs tap operator allows us to execute some code here without
        //     // altering the data that is funneled through the response.  So, here
        //     // indeed we will get recipes array so we just call setRecipes() from
        //     // here instead of from subscribe below.  So, we now can remove 
        //     // the subscribe() call below.
        //     tap(recipes => {
        //         // so we access the data in response as we still want to set the
        //         // recipes here in recipes service but we dont want to subscribe
        //         // here as we want our RecipeResolverService to do that for us so
        //         // we can guard the routes and prevent error when we say refresh
        //         // on recipe detail page without first loading recipes from the 
        //         // Firebase backend.
        //         this.recipeService.setRecipes(recipes);
        //     })
        // )

            // .subscribe(response => {
            //     console.log(response);
            //     // response is Recipe[] but Angular does not know that, so we use
            //     // get<Recipe[]> above to transform response we got into Recipe[].  Of
            //     // course, this means our returned response must be an array of recipes
            //     // which in this case is the case.
            //     this.recipeService.setRecipes(response); 
            // });
}