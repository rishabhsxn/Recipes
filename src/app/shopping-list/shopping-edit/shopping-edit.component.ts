import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from '../shopping.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  // @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  // @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;
  @Output() ingredientAdded = new EventEmitter<Ingredient>();
  @ViewChild('f', { static: false }) itemForm: NgForm;
  editMode: boolean = false;
  editIngredientIndex: number;
  subscription: Subscription;

  constructor(private shoppingService: ShoppingService) {}

  ngOnInit(): void {
    this.subscription = this.shoppingService.editIngredientMode.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editIngredientIndex = index;
        const ingredientToEdit =
          this.shoppingService.getIngredientByIndex(index);
        this.populateIngredientForEdit(ingredientToEdit);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  populateIngredientForEdit(ingredient: Ingredient): void {
    this.itemForm.setValue({
      name: ingredient.name,
      amount: ingredient.amount,
    });
  }

  onSubmit(f: NgForm) {
    const formValues = f.value;
    if (this.editMode)
      this.shoppingService.updateIngredient(
        this.editIngredientIndex,
        new Ingredient(formValues.name, formValues.amount)
      );
    else
      this.ingredientAdded.emit(
        new Ingredient(formValues.name, formValues.amount)
      );

    this.resetForm();
  }

  resetForm(): void {
    this.editMode = false;
    this.itemForm.reset();
  }

  onClear(): void {
    this.resetForm();
  }

  onDelete(): void {
    this.shoppingService.deleteIngredient(this.editIngredientIndex);
    this.resetForm();
  }
}
