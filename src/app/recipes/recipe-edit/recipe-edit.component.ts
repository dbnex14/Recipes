import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup; // so reactive approach here

  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService) { }

  // getter to retrieve controls in form generated using reactie approach
  get formControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          // if no id, editMode is 'new'; otherwise, 'edit'
          this.editMode = params['id'] != null;
          this.initForm(); // init form whenever route params change since that means we are reloading page
        }
      );
  }

  onSubmit() {
    console.log(this.recipeForm);
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      // If recipe has ingredients, loop through them and for each
      // create new FormGroup with name and amount controls and push
      // them onto the array.
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup ({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/) // note how we pass RG btw 2 / here
              ])
            })
          );
        }
      }
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
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
}
