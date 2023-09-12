import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { DataStorageService } from './../shared/data-storage.service';
import { NgForm } from '@angular/forms';
import {
  FirebaseShoppingLists,
  ShoppingList,
} from '../interfaces/shoppingLists';
import { ManageListsService } from '../shopping-lists/manage-lists.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  @ViewChild('f') listNameForm: NgForm;
  shoppingLists: ShoppingList[]; // # Todo make this into separate component
  shoppingListId: string = '';
  shoppingListSaverIsOpen = false;
  showDropdown = false;
  ingredients: Ingredient[] = [];
  isError: boolean = false;
  alert: { isCallingApi: boolean; message: string } = {
    isCallingApi: false,
    message: '',
  };
  private igChangeSub: Subscription;

  constructor(
    private slService: ShoppingListService,
    private manageListsService: ManageListsService
  ) {}

  ngOnInit() {
    this.ingredients = this.slService.getIngredients();
    this.igChangeSub = this.slService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
        // this.dataStorageService.storeShoppingList(); // store in db upon change
      }
    );
    this.setShoppingList();
  }

  ngOnDestroy(): void {
    this.igChangeSub.unsubscribe();
  }

  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }

  // new implementation
  onLoadList(shoppingListId: number | string) {
    const { id, ingredients } = this.getShoppingListById(shoppingListId);
    this.shoppingListId = id;
    this.ingredients = ingredients;
    this.slService.setIngredients(ingredients);
  }

  onSaveShoppingList(form: NgForm) {
    const name = form.value.listName;
    this.alert = { isCallingApi: true, message: 'Saving shopping list...' };
    this.manageListsService.storeShoppingLists(name, this.handleError);
    setTimeout(() => {
      this.onSetAlertToDefault();
      this.shoppingListSaverIsOpen = false;
    }, 2000);
  }

  toggleShoppingListSaverVisibility() {
    console.log('Toggling visibility...');
    this.shoppingListSaverIsOpen = !this.shoppingListSaverIsOpen;
  }

  onClearList() {
    if (!confirm('Are you sure you want to clear the shopping list?')) return;

    this.slService.clearIngredients();
  }

  onDeleteList(id: string | number) {
    if (!confirm('Are you sure you want to delete this list?')) return;
    this.manageListsService.deleteShoppingList(id, this.handleError);
    this.setShoppingList();
  }

  onSetAlertToDefault() {
    this.alert = { isCallingApi: false, message: '' };
  }

  onCloseAlert() {
    this.onSetAlertToDefault();
  }

  handleError(message?: string) {
    this.isError = true;
    this.alert = { isCallingApi: true, message };
  }

  toggleListDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  //helpers
  private getShoppingListById(id: string | number) {
    return this.shoppingLists.find((list) => list.id === id);
  }

  private convertDbShoppingListToShoppingList(
    dbShoppingLists: FirebaseShoppingLists
  ) {
    const shoppingLists: ShoppingList[] = [];
    for (const key in dbShoppingLists)
      shoppingLists.push({ id: key, ingredients: dbShoppingLists[key] });

    console.log('allLists: ', shoppingLists);
    return shoppingLists;
  }

  // # Consider moving this elsewhere and simplifying
  private setShoppingList() {
    this.manageListsService.fetchShoppingLists()
    .subscribe(
      (dbShoppingLists) => {
        this.shoppingLists =
          this.convertDbShoppingListToShoppingList(dbShoppingLists);
      },
      (error) =>
        this.handleError(
          'Oops there was a problem fetching on the server. ' + error.statusText
        )
    );
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

// old implementation
/*  onLoadShoppingLists(){
    this.alert = { isCallingApi: true, message: 'Loading all lists..'};
     this.dataStorageService.fetchShoppingLists().subscribe( dbShoppingLists => {
      const shoppingLists: ShoppingList[] = [];
        for(const key in dbShoppingLists)
          shoppingLists.push({ id: key, ingredients: dbShoppingLists[key] });

      console.log('allLists: ', shoppingLists);
      this.shoppingLists =  shoppingLists;

      setTimeout(() => {
        this.onSetAlertToDefault()
      }, 2000);
  }, error => this.handleError("Oops there was a problem fetching on the server. " + error.statusText));
  } */
