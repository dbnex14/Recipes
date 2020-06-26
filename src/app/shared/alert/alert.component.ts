import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent {
    // We want this property to be settable from outside so @Input
    @Input() message: string;
    // Make this event emittable to the outside of component by @Output
    @Output() close = new EventEmitter<void>();

    onClose() {
        // emit event to subscribers
        this.close.emit();
    }
}