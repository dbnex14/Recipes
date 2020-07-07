import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';
import * as fromAuthActions from '../auth/store/auth.actions';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  isAuthenticated = false;
  collapsed = true;

  constructor(
    private dataStorageService: DataStorageService, 
    private authService: AuthService,
    private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    //this.userSubscription = this.authService.user.subscribe(user => {
      this.userSubscription = this.store
        .select('auth')
        .pipe(map(authState => authState.user))
        .subscribe(user => {
            this.isAuthenticated = !!user; // same as !user ? false : true;
            console.log(!user);
            console.log(!!user);
        });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  onSaveData() {
    console.log("onSaveData called");
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    // Note that if you dont care about the Response, you dont even have to 
    // pass function to subscribe method.
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    //this.authService.logout();
    this.store.dispatch(new fromAuthActions.LogoutAction());
  }
}
