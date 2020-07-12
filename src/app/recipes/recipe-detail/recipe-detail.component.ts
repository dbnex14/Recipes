import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

import * as fromApp from '../../store/app.reducer';
import * as fromRecipeActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  // we inject ActivatedRoute so we can get parameters passed through the router like
  // 'localhost:4200/recipes/id'.  To get this id, we can use ActivatedRoute and then
  // call recipe service to fetch that recipe.  That way our template will be able to
  // continue to use property bindings on recipe property.
  constructor(private recipeService: RecipeService
    , private route: ActivatedRoute
    , private router: Router
    , private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    // now that we got the ActivatedRoute injected we can use it to get the id passed
    // in by the route.  We can do it in 2 ways as explained before:
    // 1. using snapshot which only works first time this component is loaded but it
    //    will not work if this id is changing during the time component has already
    //    been loaded.  This howeever will not work since our recipes list is on the
    //    left and recipe detail on the right so we are able to change this id by
    //    selecting another recipe on the left in order to load another recipe.
    //const id = this.route.snapshot.params['id'];
    // 2. using params observable which subscribes to a callback to get the id.  With
    //    that we can react no any changes and load different recipe details.
    //
    // 1st approach Max showed when using NGRX store
    // this.route.params
    //   .subscribe((params: Params) => {
    //       this.id = +params['id'];
    //       //this.recipe = this.recipeService.getRecipe(this.id);
    //       this.store.select('recipes').pipe(
    //         map(recipesState => {
    //           return recipesState.recipes.find((recipe, index) => {
    //             return index === this.id;
    //           });
    //         })
    //       ).subscribe(recipe => {
    //         this.recipe = recipe;
    //       })
    //   });
    //
    // 2nd approach Max showed when using NGRX store
    this.route.params
    .pipe(
      map(params => {
        return +params['id'];
      }),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id;
        });
      })
    )
    .subscribe(recipe => {
      this.recipe = recipe;
    });
  }

  onAddToShoppingList() {
    // we could here directly access shopping list service or we could 
    // access recipe service which then accesses shopping list.  it is 
    // decision we have to make, there is more than one way of doing it.
    // here we will access reicpe service to do this funtionality.
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    // Note that we dont need to provide id here as router will take care of that.
    this.router.navigate(['edit'], { relativeTo: this.route });

    // Here we deliberately construct path that also provides ID but again, this is
    // just to demonstrate and not needed at all.
    //this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route }); //localhost:4200/recipes/1/edit
  }

  onDeleteRecipe() {
    //this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new fromRecipeActions.DeleteRecipeAction(this.id));
    this.router.navigate(['/recipes']);
  }
}
