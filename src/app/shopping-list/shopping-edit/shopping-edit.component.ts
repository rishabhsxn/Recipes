import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { AppState } from 'src/app/store/state';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) itemForm: NgForm;
  editMode: boolean = false;
  editIngredientIndex: number;
  storeSubscription: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.storeSubscription = this.store
      .select('shoppingList')
      .subscribe((state) => {
        if (state.isEditMode && state.editIngredientIndex > -1) {
          // edit mode
          this.editMode = true;
          this.editIngredientIndex = state.editIngredientIndex;
          this.populateIngredientForEdit(
            state.ingredients[state.editIngredientIndex]
          );
        } else this.editMode = false;
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(ShoppingListActions.SetAddMode());
    this.storeSubscription.unsubscribe();
  }

  populateIngredientForEdit(ingredient: Ingredient): void {
    this.itemForm.setValue({
      name: ingredient.name,
      amount: ingredient.amount,
    });
  }

  onSubmit(f: NgForm) {
    const formValues = f.value;
    if (this.editMode)
      this.store.dispatch(
        ShoppingListActions.UpdateIngredient({
          payload: {
            id: this.editIngredientIndex,
            updatedIngredient: new Ingredient(
              formValues.name,
              formValues.amount
            ),
          },
        })
      );
    else
      this.store.dispatch(
        ShoppingListActions.AddIngredient({
          payload: {
            ingredient: new Ingredient(formValues.name, formValues.amount),
          },
        })
      );

    this.resetForm();
  }

  resetForm(): void {
    this.editMode = false;
    this.itemForm.reset();
    this.store.dispatch(ShoppingListActions.SetAddMode());
  }

  onClear(): void {
    this.resetForm();
  }

  onDelete(): void {
    this.store.dispatch(
      ShoppingListActions.DeleteIngredient({
        payload: { id: this.editIngredientIndex },
      })
    );
    this.resetForm();
  }
}
