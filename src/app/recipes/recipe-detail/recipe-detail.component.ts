import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipe: Recipe;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
  }

  onAddToShoppingList() {
    // we could here directly access shopping list service or we could 
    // access recipe service which then accesses shopping list.  it is 
    // decision we have to make, there is more than one way of doing it.
    // here we will access reicpe service to do this funtionality.
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }
}
