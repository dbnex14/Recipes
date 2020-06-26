import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    // selector is an attribute selector (hence []) so we can add it to any element.
    selector: '[appPlaceholder]'
})
export class PlaceHolderDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}