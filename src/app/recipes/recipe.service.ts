import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipesUpdated = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.recipesUpdated.next(this.getRecipes());
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }
}
