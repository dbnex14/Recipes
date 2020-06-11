import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService {
    ingredientChanged = new Subject<Ingredient[]>(); // we changed this from EventEmitter to Subject
    startedEditing = new Subject<number>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
      ];
      
    getIngredient(index: number) {
        return this.ingredients[index];
    }

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
        // Since we changed this to use Subject, we use next() instead of emit()
        this.ingredientChanged.next(this.ingredients.slice());
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
        // Since we changed this to use Subject, we use next() instead of emit()
        this.ingredientChanged.next(this.ingredients.slice());
    }

    updateIngredient(index: number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient;
        this.ingredientChanged.next(this.ingredients.slice());
    }
}