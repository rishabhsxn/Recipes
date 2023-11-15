import { AuthState } from '../auth/store/auth.store';
import { RecipeState } from '../recipes/store/recipe.store';
import { ShoppingListState } from '../shopping-list/store/shopping-list.state';

export interface AppState {
  shoppingList: ShoppingListState;
  auth: AuthState;
  recipe: RecipeState;
}
