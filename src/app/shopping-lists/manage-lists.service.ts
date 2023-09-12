import { Injectable } from "@angular/core";
import { FirebaseShoppingLists, ShoppingList } from "../interfaces/shoppingLists";
import { DataStorageService } from "../shared/data-storage.service";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";

@Injectable()
export class ManageListsService{
   shoppingLists: ShoppingList[] = [];
   shoppingListsChanged = new Subject<ShoppingList[]>();

   constructor(private dataStorageService: DataStorageService){}

   setShoppinglists(list: ShoppingList[]){
    this.shoppingLists = list;
    this.notifyShoppingListsChanged();
  }

  getShoppingLists(){
    return this.shoppingLists.slice();
  }

  storeShoppingLists(name: string, handleError: (message: string) => void){
    this.dataStorageService.storeShoppingLists(name)
      .subscribe(() =>  this.notifyShoppingListsChanged(), 
        (err) => handleError( 'Oops there was a problem saving on the server. ' + err.statusText
    ));
  }

  deleteShoppingList(id: string|number, handleError: (message: string) => void ){
    this.dataStorageService.deleteShoppingList(id).subscribe(() => this.notifyShoppingListsChanged(),
    (err) =>
      handleError(
        'Oops there was a problem saving on the server. ' + err.statusText
      ));
    
  }

  fetchShoppingLists(){
    return this.dataStorageService.fetchShoppingLists()
            .pipe( map(lists => {
              this.shoppingLists = this.convertDbShoppingListToShoppingList(lists);
              this.notifyShoppingListsChanged();
                return this.shoppingLists.slice();
            }));
          }

  getShoppingListById(id: string | number) {
    return this.shoppingLists.find((list) => list.id === id);
  }

  notifyShoppingListsChanged(){
    this.shoppingListsChanged.next(this.shoppingLists.slice());
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