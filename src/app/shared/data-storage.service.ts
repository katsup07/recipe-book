import { HttpClient } from "@angular/common/http";
import { Injectable  } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs/operators";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Ingredient } from "./ingredient.model";
import { environment } from "src/environments/environment";


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

    storeShoppingList(errorHandler: (message: string) => void){
      let allIngredients = this.slService.getIngredients();
      console.log('allIngredients: ', allIngredients);
      this.http.put(environment.firebaseURL + 'shopping-list.json', allIngredients)
        .subscribe(() => null, err => errorHandler("Oops there was a problem saving on the server. " + err.statusText));
    }

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
  

}