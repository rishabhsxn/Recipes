import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import * as RecipeActions from './recipe.actions';
import { AppState } from 'src/app/store/state';
import { Recipe } from '../recipe.model';

@Injectable()
export class RecipeEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private http: HttpClient
  ) {}

  saveRecipes = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipeActions.SaveRecipes),
        withLatestFrom(this.store.select('recipe')),
        switchMap(([saveRecipeAction, recipeState]) => {
          return this.http.put(
            'https://angular-recipe-5ced7-default-rtdb.firebaseio.com/recipes.json',
            recipeState.recipes
          );
        })
      ),
    { dispatch: false }
  );

  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipeActions.FetchRecipes),
      switchMap(() => {
        return this.http.get<Recipe[]>(
          'https://angular-recipe-5ced7-default-rtdb.firebaseio.com/recipes.json'
        );
      }),
      map((recipes) =>
        recipes.map((recipe) => ({
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : [],
        }))
      ),
      map((recipes) =>
        RecipeActions.SetRecipes({ payload: { recipes: recipes } })
      )
    )
  );
}
