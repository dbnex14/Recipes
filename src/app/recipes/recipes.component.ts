import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  selectedRecipe: Recipe;

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeWasSelected(recipe: Recipe) {
    // Note that we could have assigned this recipe to selectedRecipe
    // inside the template as well where we listen to recipeWasSelected
    // emitted event by simply doing like:
    // <app-recipe-list (recipeWasSelected)="selectedRecipe = $event"></app-recipe-list>
    // but it is generally better to not polute template with logic.
    this.selectedRecipe = recipe;
  }
}
