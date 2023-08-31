import { HttpClient } from "@angular/common/http";
import { Injectable  } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs/operators";


@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService){}
  
    storeRecipes(){
      const allRecipes = this.recipeService.getRecipes();
      this.http.put('https://ng-recipes-9fbf3-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json', allRecipes)
        .subscribe(resData => console.log(resData));
    }

    fetchRecipes(){
      return this.http.get<Recipe[]>('https://ng-recipes-9fbf3-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json')
        .pipe(
          map(recipes => {
          return recipes.map( recipe => ({...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}))
        }),
          tap( recipes =>  this.recipeService.setRecipes(recipes))
      )
    }
  

}