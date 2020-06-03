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
}