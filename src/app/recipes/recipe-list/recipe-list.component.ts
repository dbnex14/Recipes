import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(
    //private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // here we subscribe to recipeChanged Subject emited from recipe.service
    // in order to update UI when user adds new or modifies existing recipe.
    //this.subscription = this.recipeService.recipeChanged  // using ngrx instead of this
    this.subscription = this.store.select('recipes')
      .pipe(map(recipesState => recipesState.recipes))
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        }
      );
    //this.recipes = this.recipeService.getRecipes();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onNewRecipe() {
    // Navigate to 'new' route but in order to do so, we also need to inform
    // our router about our current route.  To do that we also inject
    // ActivatedRoute and use relativeTo
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
