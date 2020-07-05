import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
//import { ShoppingListService } from './shopping-list.service';
import { Subscription, Observable } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients: Ingredient[]}>;
  //private subscription: Subscription; // no longer needed, we use NgRx store

  constructor(
    //private slService: ShoppingListService, 
    private loggingService: LoggingService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // Use NgRx store instead of service below but select() returns observable, so we must
    // change ingredients type from array to above and then we have to change ngFor in template
    // since ngFor works only on arrays.  For that, we use async pipe in template to get result
    // of this observable as soon as it is available.
    this.ingredients = this.store.select('shoppingList'); 
    // Also note that if you need to use this some other place where you cannot use async pipe,
    // you can subscribe to select() since it returns an observable.  NgRx should auto unsubscribe
    // if for you but Max recommends storing reference and doing it manually.
    //this.subscription = this.store.select('shoppingList').subscribe(...);

    // Below is using service to get list of ingredients and to subscribe to their changes.
    // But we commented that out since now for that we use NGRX store above.
    // this.ingredients = this.slService.getIngredients();
    // // Previously we used EventEmitter and subscribed to it.  That code
    // // does not need any change when we replace EventEmitter with Subject,
    // // so code below needed no change at all.  However, we do need to
    // // store this subscription in a property and unsubscribe from it once
    // // no longer needed.
    // this.subscription = this.slService.ingredientChanged.subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // );

    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit');
  }

  ngOnDestroy(): void {
    //this.subscription.unsubscribe(); // no longer needed, we use NgRx store
  }

  onEditItem(index: number) {
    // Nowe we need to get this index into the shopping-edit component
    // because that is where we are editing.  So, we added Subject in our
    // ShoppingListService which we have injected here already and emit this
    // value so we can listen to it some other place like in shopping-edit component.
    //this.slService.startedEditing.next(index);  //use service
    this.store.dispatch(new ShoppingListActions.StartEditIngredientAction(index)); // use ngrx
  }
}
