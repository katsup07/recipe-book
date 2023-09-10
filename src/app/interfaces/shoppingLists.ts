import { Ingredient } from "../shared/ingredient.model"


export interface FirebaseShoppingLists{ [name: string]: Ingredient[]}; //

export interface ShoppingList{
  id: string;
  ingredients: Ingredient[];
}