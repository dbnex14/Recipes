import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipeService } from '../../recipe.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  // to get this recipe from outside we need @Input()
  @Input() recipe: Recipe;

  constructor(private recipeservice: RecipeService) { }

  ngOnInit(): void {
  }

  onSelected() {
    this.recipeservice.recipeSelected.emit(this.recipe);
  }
}
