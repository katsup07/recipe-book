import { Component, Input, OnInit } from '@angular/core';
import { ShoppingList } from '../interfaces/shoppingLists';

@Component({
  selector: 'app-shopping-lists',
  templateUrl: './shopping-lists.component.html',
  styleUrls: ['./shopping-lists.component.css']
})
export class ShoppingListsComponent implements OnInit {
  @Input() onLoadList: (id: string) => void;
  @Input() onDeleteList: (id: string) => void;
  @Input() shoppingLists: ShoppingList[];
  @Input() shoppingListId: string;
  showDropdown: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  toggleListDropdown() {
    this.showDropdown = !this.showDropdown;
  }


}
