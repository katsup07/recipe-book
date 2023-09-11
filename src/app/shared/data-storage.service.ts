import { HttpClient } from "@angular/common/http";
import { Injectable  } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs/operators";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Ingredient } from "./ingredient.model";
import { environment } from "src/environments/environment";
import { ShoppingList, FirebaseShoppingLists } from "../interfaces/shoppingLists";


@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService, private slService: ShoppingListService){}
  
    storeRecipes(){
      const allRecipes = this.recipeService.getRecipes();
      this.http.put(environment.firebaseURL + 'recipes.json', allRecipes)
        .subscribe();
    }

    fetchRecipes(){
      return this.http.get<Recipe[]>(environment.firebaseURL + 'recipes.json')
        .pipe(
          map(recipes => {
          return recipes.map( recipe => ({...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}))
        }),
          tap( recipes =>  this.recipeService.setRecipes(recipes))
      )
    }

    // Old implementations
    // Single List
    fetchShoppingList(){
      return this.http.get<Ingredient[]>(environment.firebaseURL + 'shopping-list.json').pipe( tap(dbIngredients =>  {
        const localIngredients = this.slService.getIngredients();
        let allIngredients = [];

        if(dbIngredients === null)
          allIngredients = [...localIngredients];
        else
          allIngredients = [...localIngredients, ...dbIngredients];

        this.slService.setIngredients(allIngredients);
    }))
    }

    storeShoppingList(errorHandler: (message: string) => void){
      let allIngredients = this.slService.getIngredients();
      console.log('allIngredients: ', allIngredients);
      this.http.put(environment.firebaseURL + 'shopping-lists.json', allIngredients)
        .subscribe(() => null, err => errorHandler("Oops there was a problem saving on the server. " + err.statusText));
    }

    // New implementations
    // Multiple Lists
    fetchShoppingLists(){
      return this.http.get<FirebaseShoppingLists>(environment.firebaseURL + 'shopping-lists.json').pipe( map(allLists =>  {

        return allLists;
      }));
    }

    // stores a single list in the lists collection
    storeShoppingLists(name: string, errorHandler: (message: string) => void){
      const listName = this.makeIntoCababCase(name);
      let allIngredients = this.slService.getIngredients();
      console.log('allIngredients: ', allIngredients);
      this.http.put(environment.firebaseURL + 'shopping-lists/' + listName + '.json', allIngredients)
        .subscribe(() => null, err => errorHandler("Oops there was a problem saving on the server. " + err.statusText));
    }

    deleteShoppingList(id: string | number, errorHandler: (message: string) => void){
      this.http.delete(environment.firebaseURL + 'shopping-lists/' + id + '.json',)
      .subscribe((res) => console.log(res), err => errorHandler("Oops there was a problem saving on the server. " + err.statusText));
    }
  
    // Helpers
    makeIntoCababCase(s: string){
      return s.split(' ').join('-');
    }
}