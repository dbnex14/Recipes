import { Component, OnInit } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
  }

  // We are receiving reference to NgForm, so this is template-driven approach.
  // This way, we can get references to our ngModel marked fields in the template.
  onAddItem(form: NgForm) {
    const value = form.value;
    // now we can get access to ngModel marked input fields name and amount in 
    // template.  These are the names we gave to these 2 fields.
    const newIngredient = new Ingredient(value.name, value.amount);
    this.slService.addIngredient(newIngredient);
  }
}
