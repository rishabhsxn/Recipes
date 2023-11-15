import { createReducer, on } from '@ngrx/store';
import { initialState } from './shopping-list.state';
import * as ShoppingActions from './shopping-list.actions';

export const ShoppingListReducer = createReducer(
  initialState,

  on(ShoppingActions.AddIngredient, (state, action) => ({
    ...state,
    ingredients: [...state.ingredients, action.payload.ingredient],
  })),

  on(ShoppingActions.AddIngredients, (state, action) => ({
    ...state,
    ingredients: [...state.ingredients, ...action.payload.ingredients],
  })),

  on(ShoppingActions.UpdateIngredient, (state, action) => {
    const ingredient = state.ingredients[action.payload.id];
    const updatedIngredient = {
      ...ingredient,
      ...action.payload.updatedIngredient,
    };
    const updatedIngredients = [...state.ingredients];
    updatedIngredients[action.payload.id] = updatedIngredient;
    return {
      ...state,
      ingredients: updatedIngredients,
    };
  }),

  on(ShoppingActions.DeleteIngredient, (state, action) => ({
    ...state,
    ingredients: state.ingredients.filter(
      (ingredient, index) => index !== action.payload.id
    ),
  })),

  on(ShoppingActions.SetEditMode, (state, action) => ({
    ...state,
    isEditMode: true,
    editIngredientIndex: action.payload.id,
  })),

  on(ShoppingActions.SetAddMode, (state, action) => ({
    ...state,
    isEditMode: false,
    editIngredientIndex: -1,
  }))
);
