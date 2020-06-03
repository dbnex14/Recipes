import { Ingredient } from '../shared/ingredient.model';
import { EventEmitter } from '@angular/core';

export class ShoppingListService {
    ingredientChanged = new EventEmitter<Ingredient[]>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
      ];
      
    getIngredients() {
        // here we return slice of this array to create new copy of
        // it and prevent outsiders modifying it since array is ref type.
        return this.ingredients.slice();
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        // Emit the copy of changed array so we can listen 
        // to it and update.  This is necessary since we return 
        // ingredients slice from getIngredients() above.
        this.ingredientChanged.emit(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
        // while looping to add ingredients is viable, it would 
        // emit lots of events so we add all ingredients in one go
        // and then emit one event.  Note use of spread operator ...
        // to push elements of one array into another array as
        // opposed to looping and pushing one-by-one.
        this.ingredients.push(...ingredients);
        // for (let ingredient of ingredients) {
        //     this.addIngredient(ingredient);
        // }

        // finally emit single event by emitting copy of updated array
        this.ingredientChanged.emit(this.ingredients.slice());
    }
}