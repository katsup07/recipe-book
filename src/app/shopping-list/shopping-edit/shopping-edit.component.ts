import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  @ViewChild('f') slForm: NgForm;
  @Input() shoppingListSaverIsOpen: boolean;


  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.slService.getIngredient(index);
      this.slForm.setValue({ name: this.editedItem.name, amount: this.editedItem.amount });
    });
  }

  ngOnDestroy(){
      this.subscription.unsubscribe();
  }


  onAddOrEditItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    
    if(this.editMode)
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    else
      this.slService.addIngredient(newIngredient);
    
    this.onClear();
  }

  onDelete(){
    // No item selected in list
    if(!this.editedItem)
     return alert('Item not found in shopping list. Click item in list first and then delete.');
    // Item selected in list
    if(!confirm(`Are you sure you want to delete "${this.editedItem.name} - ${this.editedItem.amount}"?`))
        return;
  
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
    this.editedItem = null;
    this.editedItemIndex = null;
  }

}
