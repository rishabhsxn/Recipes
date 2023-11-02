import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingService {
  ingredientsChanged = new Subject<Ingredient[]>();
  editIngredientMode = new Subject<number>();

  ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  getIngredientByIndex(index: number): Ingredient {
    return this.ingredients.slice().at(index);
  }

  addIngredient(newIngredient: Ingredient): void {
    this.ingredients.push(newIngredient);
    // send the new ingredient list to subscribers
    this.ingredientsChanged.next(this.getIngredients());
  }

  addIngredients(newIngredients: Ingredient[]): void {
    this.ingredients.push(...newIngredients);
    this.ingredientsChanged.next(this.getIngredients());
  }

  updateIngredient(index: number, updatedIngredient: Ingredient): void {
    this.ingredients[index] = updatedIngredient;
    this.ingredientsChanged.next(this.getIngredients());
  }

  deleteIngredient(index: number): void {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.getIngredients());
  }
}
