import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core.module';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import * as fromApp from './store/app.reducer';
import { AuthEffects }from './auth/store/auth.effects';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    // So we need to import here our app routing module we added to configure our routes.
    // Now we need a place in our app to render our routes.  We will do that in 
    // our app.component by replacing current
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects]),
    SharedModule,
    CoreModule
  ],
  providers: [
    //LoggingService
    // moved to CoreModule
    // ShoppingListService, 
    // RecipeService, 
    // {
    //   provide: HTTP_INTERCEPTORS, 
    //   useClass: AuthInterceptorService,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
  // moved to shared module
  // entryComponents: [
  //   AlertComponent
  // ]
})
export class AppModule { }
