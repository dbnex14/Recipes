import { Recipe } from './recipe.model';
import { EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe(
            'Noodles'
            , 'Fetuchinnies'
            , 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2018/9/26/0/FNK_Tuscan-Chicken-Skillet_H2_s4x3.jpg.rend.hgtvcom.826.620.suffix/1537973085542.jpeg'
            , [
                new Ingredient('Fetuchinni Noodles', 1),
                new Ingredient('Chicked bits', 6),
                new Ingredient('Spinach', 2)
            ]
        ),
        new Recipe(
            'Garlick Bunns'
            , 'Buns'
            , 'https://149366112.v2.pressablecdn.com/wp-content/uploads/2020/04/img_4211-2-768x768-1.jpg'
            , [
                new Ingredient('Buns', 2),
                new Ingredient('Garlic', 1),
                new Ingredient('Salt', 1),
                new Ingredient('Oregano', 1),
                new Ingredient('Olive Oil', 1)
            ]
        )
      ];

  getRecipes() {
    return this.recipes.slice();
  }
}