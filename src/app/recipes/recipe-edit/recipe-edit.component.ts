import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import { AppState } from 'src/app/store/state';
import * as RecipeActions from '../store/recipe.actions';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipeState } from '../store/recipe.store';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  editMode: boolean = false;
  recipeId: number;
  recipeForm: FormGroup;
  storeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.recipeId = +params['id'];
      this.editMode = params['id'] != null;

      this.initForm();
    });
  }

  ngOnDestroy(): void {
    if (this.storeSubscription) this.storeSubscription.unsubscribe();
  }

  private initForm(): void {
    let recipe: Recipe;

    if (this.editMode) {
      this.storeSubscription = this.store
        .select('recipe')
        .pipe(
          map((recipeState: RecipeState) =>
            recipeState.recipes.find((rec, index) => index === this.recipeId)
          )
        )
        .subscribe((recipeEl: Recipe) => {
          recipe = recipeEl;
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipe ? recipe.name : '', Validators.required),
      imagePath: new FormControl(
        recipe ? recipe.imagePath : '',
        Validators.required
      ),
      description: new FormControl(
        recipe ? recipe.description : '',
        Validators.required
      ),
      ingredients: new FormArray(
        recipe && recipe.ingredients
          ? recipe.ingredients.map(
              (ingredient) =>
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                  ]),
                })
            )
          : []
      ),
    });
  }

  onSubmit(): void {
    const recipe: Recipe = this.recipeForm.value;

    // const r: Recipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']
    // );
    console.log(recipe);

    if (this.editMode)
      this.store.dispatch(
        RecipeActions.UpdateRecipe({
          payload: { id: this.recipeId, updatedRecipe: recipe },
        })
      );
    else
      this.store.dispatch(
        RecipeActions.AddRecipe({ payload: { recipe: recipe } })
      );

    this.navigateBack();
  }

  getIngredientsControl(): AbstractControl[] {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient(): void {
    (<FormArray>this.recipeForm.get('ingredients')).controls.push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
    console.log('form:', this.recipeForm);
  }

  onCancel(): void {
    this.navigateBack();
  }

  navigateBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number): void {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
