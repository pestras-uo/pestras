/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { WorkspaceState } from '@pestras/frontend/state';
import { Role } from '@pestras/shared/data-model';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.page.html',
  styles: [
    `
      :host {
        height: var(--main-height);
        overflow-y: auto;
      }
     
    `,
  ],
})
export class WorkspacePage {
  readonly roles = Role;

  readonly workspace$ = this.state.select();

  constructor(private state: WorkspaceState) {}
}
