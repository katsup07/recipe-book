import { ChangeDetectionStrategy, Component, Input, OnInit, Pipe } from '@angular/core';
import { ShoppingList } from '../interfaces/shoppingLists';
import { ManageListsService } from './manage-lists.service';
import { ShoppingListComponent } from './../shopping-list/shopping-list.component';

@Component({
  selector: 'app-shopping-lists',
  templateUrl: './shopping-lists.component.html',
  styleUrls: ['./shopping-lists.component.css'],
  /* changeDetection: ChangeDetectionStrategy.OnPush, */
})
export class ShoppingListsComponent implements OnInit {
  @Input() onLoadList: (id: string) => void;
  @Input() onDeleteList: (id: string) => void;
  @Input() shoppingLists: ShoppingList[];
  @Input() shoppingListId: string;
  showDropdown: boolean;

  constructor(private manageListsService: ManageListsService) { }

  ngOnInit(): void {
  
  }

  toggleListDropdown() {
    this.showDropdown = !this.showDropdown;
  }


}
