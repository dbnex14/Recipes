import { Component } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  collapsed = true;

  constructor(private dataStorageService: DataStorageService) {}

  onSaveData() {
    console.log("onSaveData called");
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    // Note that if you dont care about the Response, you dont even have to 
    // pass function to subscribe method.
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
