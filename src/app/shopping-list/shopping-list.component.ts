import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { DataStorageService } from './../shared/data-storage.service';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private igChangeSub: Subscription;

  constructor(private slService: ShoppingListService, private dataStorageService: DataStorageService) {
  }

  ngOnInit() {
    this.ingredients = this.slService.getIngredients();
    this.igChangeSub = this.slService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
          // this.dataStorageService.storeShoppingList(); // store in db upon change
        }
      );
  }

  ngOnDestroy(): void {
    this.igChangeSub.unsubscribe();
  }

  onEditItem(index: number){
    this.slService.startedEditing.next(index);
  }

  onLoadShoppingList(){
     this.dataStorageService.fetchShoppingList().subscribe(ingredients => this.ingredients = [...this.ingredients, ...ingredients]);
  }

  onSaveShoppingList(){
    this.dataStorageService.storeShoppingList();
  }

  onClearList(){
    this.ingredients = [];
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






