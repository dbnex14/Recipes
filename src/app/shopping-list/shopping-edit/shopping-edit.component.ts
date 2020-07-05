import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';
//import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(
    //private slService: ShoppingListService, 
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    // Use NGRX store instead of service 
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      } else {
        this.editMode = false;
      }
    });

    // Below code uses service but we now use NGRX store above instead.
    // here we listen to our startedEditing subject and we store it in
    // property so we can clean it when we are no longer listening to it.
    // this.subscription = this.slService.startedEditing
    //   .subscribe(
    //     // we know our subscription receives index so we get it here and it is
    //     // representing item we want to edit.  And we also know that we only
    //     // get into this anonimpus function when user select item to edit, this
    //     // is important to know so we know what we should do when form is 
    //     // submitted.  Should we create new item or edit existing one.  So we can
    //     // store mode into editMode property.
    //     (index: number) => {
    //       this.editMode = true;
    //       this.editedItemIndex = index;
    //       this.editedItem = this.slService.getIngredient(index);
    //       // Now that we got all information, update name and amount fields on form
    //       // with the value from selected item.
    //       this.shoppingListForm.setValue({
    //         name: this.editedItem.name,
    //         amount: this.editedItem.amount
    //       })
    //     }
    //   );
  }

  ngOnDestroy(): void {
    // clean up subscription so we dont have memory leak
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.CancelEditIngredientAction());
  }

  // We are receiving reference to NgForm, so this is template-driven approach.
  // This way, we can get references to our ngModel marked fields in the template.
  onSubmit(form: NgForm) {
    const value = form.value;
    // now we can get access to ngModel marked input fields name and amount in 
    // template.  These are the names we gave to these 2 fields.
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      //this.slService.updateIngredient(this.editedItemIndex, newIngredient);  //using service
      this.store.dispatch(new ShoppingListActions.UpdateIngredientAction(newIngredient));// using ngrx
    } else {
      //this.slService.addIngredient(newIngredient); // using service
      this.store.dispatch(new ShoppingListActions.AddIngredientAction(newIngredient)); //using ngrx
    }
    this.editMode = false; //reset to non-edit mode
    form.reset();
  }

  onDelete() {
    // we need to let service know to remove one item in array
    // This however will throw an error if we click Delete without loading an item.
    // so we add ngIf in template to display Delete button only if in editMode.
    //this.slService.deleteIngredient(this.editedItemIndex); //using service
    this.store.dispatch
      (
        new ShoppingListActions.DeleteIngredientAction()
      );
    // and we also need to call onClear to clear form.
    this.onClear();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.CancelEditIngredientAction());
  }
}
