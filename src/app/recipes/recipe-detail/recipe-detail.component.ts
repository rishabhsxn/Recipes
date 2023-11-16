import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import { AppState } from 'src/app/store/state';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingActions from '../../shopping-list/store/shopping-list.actions';
import { map, switchMap } from 'rxjs/operators';
import { RecipeState } from '../store/recipe.store';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  recipeId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params: Params) => +params['id']),
        switchMap((recipeId: number) => {
          this.recipeId = recipeId;
          return this.store.select('recipe');
        }),
        map((recipeState: RecipeState) => recipeState.recipes.at(this.recipeId))
      )
      .subscribe((recipe: Recipe) => {
        this.recipe = recipe;
      });
  }

  addIngredientsToShoppingList(): void {
    this.store.dispatch(
      ShoppingActions.AddIngredients({
        payload: { ingredients: this.recipe.ingredients },
      })
    );
  }

  onEditRecipe(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe(): void {
    this.store.dispatch(
      RecipeActions.DeleteRecipe({ payload: { id: this.recipeId } })
    );
    // make navigation as an effect of deleting recipe when updating on server
    this.router.navigate(['/recipes']);
  }
}
