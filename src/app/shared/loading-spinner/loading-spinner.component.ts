import { Component } from '@angular/core';

// For this component, we got the css and template below from this link:
// https://loading.io/css/ by selecting aspinner.  I chose the one with bars
// running in a circle.  We could have set the templateUrl instead to point
// to the template file, but since this is used only here and it is not long,
// we do it this way.
@Component({
    selector: 'app-loading-spinner',
    template: '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>',
    styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {

}