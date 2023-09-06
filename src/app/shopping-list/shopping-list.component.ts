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
  isError: boolean = false;
  alert: {isCallingApi: boolean; message: string} = { isCallingApi: false, message: ''};
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
    this.alert = { isCallingApi: true, message: 'Appending previously saved ingredients...'};
     this.dataStorageService.fetchShoppingList().subscribe(ingredients => {
      if(ingredients)
        this.ingredients = [...this.ingredients, ...ingredients];
    
      setTimeout(() => {
        this.onSetAlertToDefault();
      }, 2000);
     }, error => this.handleError("Oops there was a problem fetching on the server. " + error.statusText)
      );
  }

  onSaveShoppingList(){
    this.alert = { isCallingApi: true, message: 'Saving shopping list...'};
    this.dataStorageService.storeShoppingList(this.handleError.bind(this));
    setTimeout(() => {
      this.onSetAlertToDefault()
    }, 2000);
  }

  onClearList(){
    this.slService.clearIngredients();
  }

  onSetAlertToDefault(){
    this.alert = { isCallingApi: false, message: ''};
  }

  onCloseAlert(){
    this.onSetAlertToDefault();
  }

  handleError(message?: string){
    this.isError = true;
    this.alert = { isCallingApi: true, message };
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






