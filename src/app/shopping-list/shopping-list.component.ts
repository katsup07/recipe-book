import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private igChangeSub: Subscription;

  constructor(private slService: ShoppingListService) {
  }

  ngOnInit() {
    this.ingredients = this.slService.getIngredients();
    this.igChangeSub = this.slService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        }
      );
  }

  ngOnDestroy(): void {
    this.igChangeSub.unsubscribe();
  }

  onEditItem(index: number){
    this.slService.startedEditing.next(index);
  }
}
 // // == No Duplicate Functions ==
  //  // For shopping list to ensure duplicate ingredients do not appear
  // private noDuplicateIngredients: Ingredient[] = [];

  // getNoDuplicateIngredients(){
  //   return this.noDuplicateIngredients.slice();
  // }
  
  // setNoDuplicateIngredients(){
  //   const tempIngredients = JSON.parse(JSON.stringify(this.ingredients)); // Deep copy
  //   this.noDuplicateIngredients = [];
  //     tempIngredients.forEach(ingredient => {
  //     if(!this.handleDuplicateIngredient(ingredient))
  //       this.noDuplicateIngredients.push(ingredient);
  
  //   })
  // }

  // handleDuplicateIngredient(ingredient: Ingredient){
  //   const duplicateIngredient= this.noDuplicateIngredients.find(ing => ing.name.toLowerCase() === ingredient.name.toLowerCase());
  //     if(duplicateIngredient){
  //       duplicateIngredient.amount += ingredient.amount;
  //       return true;
  //     }
    
  //     return false;
  // }

  // notifyNoDuplicateIngredientsChanged(){
  //   this.noDuplicateIngredientsChanged.next(this.noDuplicateIngredients.slice());
  // }






