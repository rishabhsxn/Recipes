import { Ingredient } from 'src/app/shared/ingredient.model';

export interface ShoppingListState {
  ingredients: Ingredient[];
  isEditMode: boolean;
  editIngredientIndex: number;
}

export const initialState: ShoppingListState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  isEditMode: false,
  editIngredientIndex: -1,
};
