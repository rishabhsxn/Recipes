import { createAction, props } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

// Action Types
export enum ShoppingActionTypes {
  ADD_INGREDIENT = '[ShoppingList] Add Ingredient',
  ADD_INGREDIENTS = '[ShoppingList] Add Ingredients',
  UPDATE_INGREDIENT = '[ShoppingList] Update Ingredient',
  DELETE_INGREDIENT = '[ShoppingList] Delete Ingredient',
  SET_EDIT_MODE = '[ShoppingList] Set Edit Mode',
  SET_ADD_MODE = '[ShoppingList] Set Add Mode',
}

// Actions
export const AddIngredient = createAction(
  ShoppingActionTypes.ADD_INGREDIENT,
  props<{ payload: { ingredient: Ingredient } }>()
);

export const AddIngredients = createAction(
  ShoppingActionTypes.ADD_INGREDIENTS,
  props<{ payload: { ingredients: Ingredient[] } }>()
);

export const UpdateIngredient = createAction(
  ShoppingActionTypes.UPDATE_INGREDIENT,
  props<{ payload: { id: number; updatedIngredient: Ingredient } }>()
);

export const DeleteIngredient = createAction(
  ShoppingActionTypes.DELETE_INGREDIENT,
  props<{ payload: { id: number } }>()
);

export const SetEditMode = createAction(
  ShoppingActionTypes.SET_EDIT_MODE,
  props<{ payload: { id: number } }>()
);

export const SetAddMode = createAction(ShoppingActionTypes.SET_ADD_MODE);
