import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Observable } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe> {
    constructor(private dataStorage: DataStorageService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe | Observable<Recipe> | Promise<Recipe> {
        // I want to load all recipes so return either array or recipes which we
        // cant since we have to load it forst or an observable that will in the
        // end yield an array of Recipes and that is something we can offer since
        // if we look in our data storage service where we have fetchRecipes() in
        // which we subscribe to get() http method so we just have to tweak this
        // little bit
    }
}