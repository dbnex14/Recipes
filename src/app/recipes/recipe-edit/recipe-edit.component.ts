import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

//import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import * as fromRecipeActions from '../store/recipe.actions';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup; // so reactive approach here
  private storeSubscription: Subscription;

  constructor(private route: ActivatedRoute,
    //private recipeService: RecipeService,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  // getter to retrieve controls in form generated using reactie approach
  get ingredietsControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
          this.id = +params['id'];
          // if no id, editMode is 'new'; otherwise, 'edit'
          this.editMode = params['id'] != null;
          this.initForm(); // init form whenever route params change since that means we are reloading page
        });
  }

  ngOnDestroy(): void {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name']
    //   , this.recipeForm.value['imagePath']
    //   , this.recipeForm.value['description']
    //   , this.recipeForm.value['ingredients']);

    if (this.editMode) {
      //this.recipeService.updateRecipe(this.id, newRecipe);
      //this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.store.dispatch(
        new fromRecipeActions.UpdateRecipeAction({
          index: this.id, 
          newRecipe: this.recipeForm.value
        })
      );
    } else {
      //this.recipeService.addRecipe(newRecipe);
      //this.recipeService.addRecipe(this.recipeForm.value);
      this.store.dispatch(new fromRecipeActions.AddRecipeAction(this.recipeForm.value));
    }
    // we are done at this point so navigate away by call to cancel button
    this.onCancel();
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      // const recipe = this.recipeService.getRecipe(this.id);
      this.storeSubscription = this.store
        .select('recipes')
        .pipe(
          map(recipeState => {
            return recipeState.recipes.find((recipe, index) => {
              return index === this.id;
            });
          })
        )
        .subscribe(recipe => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          if (recipe['ingredients']) {
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/)
                  ])
                })
              );
            }
          }
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }

  onAddIngredient() {
    // In order to add new ingredient we have to access 'ingredients' array from
    // our reactive approach generated form but Angular does not know its type is
    // of FormArray so we have to explicitly convert it and then push onto it new
    // FormGroup with name and amount FormControls.  Note that we dont provide any
    // values to them since user is supposed to enter then.
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
  }

  onCancel() {
    // navigate away
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }
}
