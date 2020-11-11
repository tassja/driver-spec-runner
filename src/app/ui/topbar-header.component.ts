import { Component } from '@angular/core';

@Component({
    selector: 'topbar-header',
    template: `
        <a [routerLink]="['/']" class="h-full">
            <img class="h-10" src="assets/logo-dark.svg"/>
        </a>
        <div class="flex-1 min-w-0"></div>
    `,
    styles: [`
        :host {
            display: flex;
            align-items: center;
            padding: .5rem;
            width: 100%;
            background-color: #0A0D2E;
        }
    `]
})
export class TopbarHeaderComponent {

}
