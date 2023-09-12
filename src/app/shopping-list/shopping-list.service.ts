import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingList } from '../interfaces/shoppingLists';


export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[] = []; // For recipes
  
  // Ingredients
  setIngredients(ingredients: Ingredient[]){
    this.ingredients = ingredients;
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number){
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.notifyIngredientsChanged();
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.notifyIngredientsChanged();
  }

  updateIngredient(index: number, newIngredient: Ingredient){
    this.ingredients[index] = newIngredient;
    this.notifyIngredientsChanged();
  }

  deleteIngredient(index: number){
    this.ingredients.splice(index,1);
    this.notifyIngredientsChanged();
  }

  clearIngredients(){
    this.ingredients = [];
    this.notifyIngredientsChanged();
  }

  notifyIngredientsChanged(){
    this.ingredientsChanged.next(JSON.parse(JSON.stringify(this.ingredients)));
  }

  // // Shopping Lists
  // setShoppinglists(list: ShoppingList[]){
  //   this.shoppingLists = list;
  // }

  // getShoppingLists(){
  //   return this.shoppingLists.slice();
  // }

  
}