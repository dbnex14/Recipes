import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(private recipeService: RecipeService
    , private router: Router
    , private route: ActivatedRoute) { }

  ngOnInit() {
    // here we subscribe to recipeChanged Subject emited from recipe.service
    // in order to update UI when user adds new or modifies existing recipe.
    this.recipeService.recipeChanged
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        }
      );
    this.recipes = this.recipeService.getRecipes();
  }

  ngOnDestroy(): void {
    this.recipeService.recipeChanged.unsubscribe();
  }

  onNewRecipe() {
    // Navigate to 'new' route but in order to do so, we also need to inform
    // our router about our current route.  To do that we also inject
    // ActivatedRoute and use relativeTo
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
