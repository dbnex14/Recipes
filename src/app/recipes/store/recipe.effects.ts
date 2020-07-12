import { Effect, Actions, ofType } from '@ngrx/effects';
import * as fromRecipesActions from './recipe.actions';
import { switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';

@Injectable()
export class RecipeEffects {
    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(fromRecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.httpClient
                .get<Recipe[]>(
                    'https://ng-course-recipe-book-ca2d1.firebaseio.com/recipes.json'
                )
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return { 
                    ...recipe, 
                    ingredients: recipe.ingredients ? recipe.ingredients : []};
            });
        }),
        map(recipes => {
            return new fromRecipesActions.SetRecipesAction(recipes);
        })
    );

    constructor(private actions$: Actions, private httpClient: HttpClient) {}
}