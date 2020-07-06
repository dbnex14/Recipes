import { Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';

export const ADD_INGREDIENT = '[Shopping List] Add Ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add Ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const START_EDIT_INGREDIENT = '[Shopping List] Start Edit Ingredient';
export const CANCEL_EDIT_INGREDIENT = '[Shopping List] Cancel Edit Ingredient';

export class AddIngredientAction implements Action {
    readonly type = ADD_INGREDIENT;
    constructor(public payload: Ingredient) {}
}

export class AddIngredientsAction implements Action {
    readonly type = ADD_INGREDIENTS;
    constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredientAction implements Action {
    readonly type = UPDATE_INGREDIENT;
    constructor(public payload: Ingredient) {}
}

export class DeleteIngredientAction implements Action {
    readonly type = DELETE_INGREDIENT;
    // we dont need data at all since we know which item we are editing because we are
    // starting edit process
}

export class StartEditIngredientAction implements Action {
    readonly type = START_EDIT_INGREDIENT;
    constructor(public payload: number) {}
}

export class CancelEditIngredientAction implements Action {
    readonly type = CANCEL_EDIT_INGREDIENT;
    // we dont need payload here because here we just want to reset edited ingredient
}

export type ShoppingListActionsType = 
    AddIngredientAction | 
    AddIngredientsAction | 
    UpdateIngredientAction | 
    DeleteIngredientAction |
    StartEditIngredientAction |
    CancelEditIngredientAction;