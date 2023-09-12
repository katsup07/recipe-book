import { ShoppingList } from "../interfaces/shoppingLists";

export class ManageListsService{
   shoppingLists: ShoppingList[] = [];
   
   setShoppinglists(list: ShoppingList[]){
    this.shoppingLists = list;
  }

  getShoppingLists(){
    return this.shoppingLists.slice();
  }
}