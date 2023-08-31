import { Component, OnInit } from '@angular/core';
import { RecipeService } from './recipes/recipe.service';
import { DataStorageService } from './shared/data-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService){};
  
  // Initializes recipes in RecipeBook
  ngOnInit(): void {
    this.dataStorageService.fetchRecipes().subscribe(recipes =>  this.recipeService.setRecipes(recipes));
    ;
  }
}
