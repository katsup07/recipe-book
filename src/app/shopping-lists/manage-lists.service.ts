import { Injectable } from "@angular/core";
import { ShoppingList } from "../interfaces/shoppingLists";
import { DataStorageService } from "../shared/data-storage.service";

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
    return this.dataStorageService.fetchShoppingLists();
  }

}