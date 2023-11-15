import { Recipe } from '../recipe.model';

export interface RecipeState {
  recipes: Recipe[];
}

export const initialState: RecipeState = {
  recipes: [],
};
