import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
import { AppState } from '../store/state';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  ingredients$: Observable<{ ingredients: Ingredient[] }>;
  subscriptions: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.ingredients$ = this.store.select('shoppingList');

    /* Note: Writing in this format would require us to manually manage subscription
    if we use the async pipe from angular, it is managed by angular */
    // this.store.select('shoppingList').subscribe((state) => {
    //   this.ingredients = state.ingredients;
    // });
  }

  addIngredient(newIngredient: Ingredient) {
    this.store.dispatch(
      ShoppingListActions.AddIngredient({
        payload: { ingredient: newIngredient },
      })
    );
  }

  onEditIngredient(index: number): void {
    this.store.dispatch(
      ShoppingListActions.SetEditMode({ payload: { id: index } })
    );
  }
}
