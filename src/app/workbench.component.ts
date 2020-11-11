import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpecBuildService } from './services/build.service';

@Component({
    selector: 'app-workbench',
    template: `
        <workbench-form class="w-full"></workbench-form>
        <workbench-output class="w-full flex-1 h-0"></workbench-output>
    `,
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
        }
    `]
})
export class WorkbenchComponent {
    constructor(private _route: ActivatedRoute, private _build: SpecBuildService) {}

    public ngOnInit(): void {
        this._route.paramMap.subscribe((params) => {
            if (params.has('repo')) {
                this._build.setRepository(params.get('repo'));
            }
            if (params.has('driver')) {
                this._build.setDriver(params.get('driver'));
            }
        });
    }
}
