import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './state';
import { ShoppingListReducer } from '../shopping-list/store/shopping-list.reducer';
import { AuthReducer } from '../auth/store/auth.reducer';
import { RecipeReducer } from '../recipes/store/recipe.reducer';

export const AppReducer: ActionReducerMap<AppState> = {
  shoppingList: ShoppingListReducer,
  auth: AuthReducer,
  recipe: RecipeReducer,
};
