import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { DataStorageService } from "../shared/data-storage.service";
import { RecipeService } from "./recipe.service";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]>{

  constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const allRecipes = this.recipeService.getRecipes();
    
    if(allRecipes.length > 0)
     return allRecipes;

    return this.dataStorageService.fetchRecipes(); // resolver will automatically subscribe to this subscription
  }

}