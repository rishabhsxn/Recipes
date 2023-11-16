import { createReducer, on } from '@ngrx/store';
import { initialState } from './recipe.store';

import * as RecipeActions from './recipe.actions';

export const RecipeReducer = createReducer(
  initialState,

  on(RecipeActions.AddRecipe, (state, action) => ({
    ...state,
    recipes: [...state.recipes, action.payload.recipe],
  })),

  on(RecipeActions.SetRecipes, (state, action) => ({
    ...state,
    recipes: [...action.payload.recipes],
  })),

  on(RecipeActions.UpdateRecipe, (state, action) => {
    const recipe = state.recipes[action.payload.id];
    const updatedRecipe = {
      ...recipe,
      ...action.payload.updatedRecipe,
    };

    const updatedRecipes = [...state.recipes];
    updatedRecipes[action.payload.id] = updatedRecipe;
    return {
      ...state,
      recipes: updatedRecipes,
    };
  }),

  on(RecipeActions.DeleteRecipe, (state, action) => ({
    ...state,
    recipes: state.recipes.filter((rec, index) => index !== action.payload.id),
  }))
);
