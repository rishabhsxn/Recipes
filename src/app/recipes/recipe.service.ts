import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  // recipeSelected = new EventEmitter<Recipe>();
  recipesUpdated = new Subject<Recipe[]>();

  constructor(private store: Store) {}

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Tasty Schnitzel',
  //     'A super-tasty Schnitzel - just awesome!',
  //     'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
  //     [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
  //   ),
  //   new Recipe(
  //     'Big Fat Burger',
  //     'What else you need to say?',
  //     'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
  //     [new Ingredient('Buns', 2), new Ingredient('Meat', 1)]
  //   ),
  // ];
  private recipes: Recipe[] = [];

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.recipesUpdated.next(this.getRecipes());
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipeById(id: number): Recipe {
    return this.recipes[id];
  }

  // recipeItemSelected(recipeName: string): void {
  //   this.recipeSelected.emit(
  //     this.recipes.find((recipe) => recipe.name === recipeName)
  //   );
  // }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(
      ShoppingListActions.AddIngredients({ payload: { ingredients } })
    );
  }

  addRecipe(newRecipe: Recipe): void {
    this.recipes.push(newRecipe);
    this.recipesUpdated.next(this.getRecipes());
  }

  updateRecipe(index: number, updatedRecipe: Recipe): void {
    this.recipes[index] = updatedRecipe;
    this.recipesUpdated.next(this.getRecipes());
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.recipesUpdated.next(this.getRecipes());
  }
}
