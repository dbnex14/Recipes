import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
//import { ShoppingListService } from '../shopping-list/shopping-list.service';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingListReducer from '../shopping-list/store/shopping-list.reducer';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {
    // // In order to update UI once user adds or edit recipe, we need to subscribe
    // // to Subject event we emit using next() each time we change recipe.  We will
    // // subscribe to this Subject in the recipe-list component which shows our
    // // recipes on the left.
    // recipeChanged = new Subject<Recipe[]>();
    // private recipes: Recipe[] = [];  // we no longer need dummy data, it is in Firebase now

    // // private recipes: Recipe[] = [
    // //     new Recipe(
    // //         'Noodles'
    // //         , 'Fetuchinnies'
    // //         , 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2018/9/26/0/FNK_Tuscan-Chicken-Skillet_H2_s4x3.jpg.rend.hgtvcom.826.620.suffix/1537973085542.jpeg'
    // //         , [
    // //             new Ingredient('Fetuchinni Noodles', 1),
    // //             new Ingredient('Chicked bits', 6),
    // //             new Ingredient('Spinach', 2)
    // //         ]
    // //     ),
    // //     new Recipe(
    // //         'Garlick Bunns'
    // //         , 'Buns'
    // //         , 'https://149366112.v2.pressablecdn.com/wp-content/uploads/2020/04/img_4211-2-768x768-1.jpg'
    // //         , [
    // //             new Ingredient('Buns', 2),
    // //             new Ingredient('Garlic', 1),
    // //             new Ingredient('Salt', 1),
    // //             new Ingredient('Oregano', 1),
    // //             new Ingredient('Olive Oil', 1)
    // //         ]
    // //     )
    // // ];

    // constructor(
    //     //private slService: ShoppingListService,
    //     private store: Store<fromApp.AppState>) { }

    // getRecipes() {
    //     return this.recipes.slice();
    // }

    // setRecipes(recipes: Recipe[]) {
    //     this.recipes = recipes;
    //     this.recipeChanged.next(this.recipes.slice());
    // }

    // getRecipe(id: number) {
    //     return this.recipes[id];
    //     // we could also use slice since that will give us the copy of 
    //     // the recipe array but in this case, it will not be a deep copy
    //     // so the objects will still be references, so we can just return
    //     // the object like above without slice to return direct object.
    //     // We could have also created a copy of the object by assinging
    //     // this to another variable but we did not do that.
    //     //return this.recipes.slice()['id'];
    // }

    // addIngredientsToShoppingList(ingredients: Ingredient[]) {
    //     // so we pass ingredients from recipe-detail and now we need to
    //     // pass them to shopping-list service; hence, we make this service
    //     // injectable so we can inject shopping-list service.
    //     //this.slService.addIngredients(ingredients);
    //     // Use the NGRX store instead
    //     this.store.dispatch(new ShoppingListActions.AddIngredientsAction(ingredients));
    // }

    // addRecipe(recipe: Recipe){
    //     this.recipes.push(recipe);
    //     this.recipeChanged.next(this.recipes.slice()); // emit changes
    // }

    // updateRecipe(index: number, newRecipe: Recipe) {
    //     this.recipes[index] = newRecipe;
    //     this.recipeChanged.next(this.recipes.slice()); // emit changes
    // }

    // deleteRecipe(index: number) {
    //     this.recipes.splice(index, 1);
    //     this.recipeChanged.next(this.recipes.slice()); // emit changes
    // }
}