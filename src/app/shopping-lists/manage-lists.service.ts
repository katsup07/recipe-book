import { Injectable } from "@angular/core";
import { FirebaseShoppingLists, ShoppingList } from "../interfaces/shoppingLists";
import { DataStorageService } from "../shared/data-storage.service";
import { map } from "rxjs/operators";

@Injectable()
export class ManageListsService{
   shoppingLists: ShoppingList[] = [];

   constructor(private dataStorageService: DataStorageService){}

   setShoppinglists(list: ShoppingList[]){
    this.shoppingLists = list;
  }

  getShoppingLists(){
    return this.shoppingLists.slice();
  }

  storeShoppingLists(name: string, handleError: (message: string) => void){
    this.dataStorageService.storeShoppingLists(name, handleError);
  }

  deleteShoppingList(id: string|number, handleError: (message: string) => void ){
    this.dataStorageService.deleteShoppingList(id, handleError);
  }

  fetchShoppingLists(){
    return this.dataStorageService.fetchShoppingLists()
            .pipe( map(lists => {
              this.shoppingLists = this.convertDbShoppingListToShoppingList(lists);
                return this.shoppingLists.slice();
            }));
  }

  getShoppingListById(id: string | number) {
    console.log(this.shoppingLists);
    const result = this.shoppingLists.find((list) => list.id === id);
    console.log('getShoppingListById: ', result);
    return result;
  }

  // helpers
  private convertDbShoppingListToShoppingList(
    dbShoppingLists: FirebaseShoppingLists
  ) {
    const shoppingLists: ShoppingList[] = [];
    for (const key in dbShoppingLists)
      shoppingLists.push({ id: key, ingredients: dbShoppingLists[key] });

    console.log('allLists: ', shoppingLists);
    return shoppingLists;
  }
}