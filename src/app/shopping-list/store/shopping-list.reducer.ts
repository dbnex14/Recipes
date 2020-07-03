import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
      ]
};

export function shoppingListReducer(
    state = initialState, 
    action: ShoppingListActions.AddIngredientAction) {

    switch(action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            //state.ingredients.push() // wrong, since state is immutable, so never do this
            return {
                // allways copy old state ( all properties of object) and add them to new one
                ...state, 
                // then modify a property such as ingredients but also dont loose
                // old ingredients so use spread ... operator to copy old elements
                // first, so now ingredients is a new array with old elements.  Then
                // add new element
                ingredients: [...state.ingredients, action.payload]
            };
        default:
            return state;
    }
}