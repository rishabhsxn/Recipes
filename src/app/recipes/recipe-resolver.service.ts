import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { Recipe } from './recipe.model';
import { AppState } from '../store/state';
import { RecipeState } from './store/recipe.store';
import * as RecipeActions from './store/recipe.actions';

@Injectable({
  providedIn: 'root',
})
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<AppState>, private actions$: Actions) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    return this.store.select('recipe').pipe(
      take(1),
      map((recipeState: RecipeState) => recipeState.recipes),
      switchMap((recipes) => {
        // return recipes if already present in store
        if (recipes.length > 0) return of(recipes);

        // else fetch recipees
        this.store.dispatch(RecipeActions.FetchRecipes());
        /* Resolver will wait for the action SET_RECIPES to be dispatched 
        which is dispatched when recipes are fetched */
        return this.actions$.pipe(
          ofType(RecipeActions.RecipeActionTypes.SET_RECIPES),
          take(1)
        );
      })
    );
  }
}
