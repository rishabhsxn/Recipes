import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.model';

// Action Types
export enum RecipeActionTypes {
  ADD_RECIPE = '[Recipe] Add Recipe',
  UPDATE_RECIPE = '[Recipe] Update Recipe',
  DELETE_RECIPE = '[Recipe] Delete Recipe',
  FETCH_RECIPES = '[Recipe] Fetch Recipes',
  SAVE_RECIPES = '[Recipe] Save Recipes',
}

// Action Creators
export const AddRecipe = createAction(
  RecipeActionTypes.ADD_RECIPE,
  props<{ payload: { recipe: Recipe } }>()
);

export const UpdateRecipe = createAction(
  RecipeActionTypes.UPDATE_RECIPE,
  props<{ payload: { id: number; updatedRecipe: Recipe } }>()
);

export const DeleteRecipe = createAction(
  RecipeActionTypes.DELETE_RECIPE,
  props<{ payload: { id: number } }>()
);

export const FetchRecipes = createAction(RecipeActionTypes.FETCH_RECIPES);

export const SaveRecipes = createAction(
  RecipeActionTypes.SAVE_RECIPES,
  props<{ payload: { recipes: Recipe[] } }>()
);
