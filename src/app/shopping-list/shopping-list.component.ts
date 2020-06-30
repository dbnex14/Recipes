import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private subscription: Subscription;

  constructor(private slService: ShoppingListService, private loggingService: LoggingService) { }

  ngOnInit() {
    this.ingredients = this.slService.getIngredients();
    // Previously we used EventEmitter and subscribed to it.  That code
    // does not need any change when we replace EventEmitter with Subject,
    // so code below needed no change at all.  However, we do need to
    // store this subscription in a property and unsubscribe from it once
    // no longer needed.
    this.subscription = this.slService.ingredientChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );

    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onEditItem(index: number) {
    // Nowe we need to get this index into the shopping-edit component
    // because that is where we are editing.  So, we added Subject in our
    // ShoppingListService which we have injected here already and emit this
    // value so we can listen to it some other place like in shopping-edit component.
    this.slService.startedEditing.next(index);
  }
}
