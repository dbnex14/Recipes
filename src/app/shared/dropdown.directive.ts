import { Directive, HostListener, HostBinding } from '@angular/core';

// to use this directive, make sure you add it to declaration section of app.module.ts.
@Directive({
    selector: '[appDropdown]'
  })
  export class DropdownDirective {
    // What? I want to add certain css class to the element it sits on once element is clicked
    //       and remove it once clicked again.
    // to dynamicly attach/detach css class based on this, we add @HostBinding and we attach
    // to css class open.
    @HostBinding('class.open') isOpen = false;
  
    // to listen to a click we add @HostListener on that event and we execute toggleOpen method.
    @HostListener('click') toggleOpen() {
      this.isOpen = !this.isOpen;
    }
  }

  // If you want that a dropdown can also be closed by a click anywhere outside (which also  
  // means that a click on one dropdown closes any other one, btw.), replace the code of 
  // dropdown.directive.ts by this one (placing the listener not on the dropdown, but on 
  // the document):
//   import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';
     
//   @Directive({
//     selector: '[appDropdown]'
//   })
//   export class DropdownDirective {
//     @HostBinding('class.open') isOpen = false;
//     @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
//       this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
//     }
//     constructor(private elRef: ElementRef) {}
//   }