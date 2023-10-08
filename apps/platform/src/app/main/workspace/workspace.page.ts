/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { WorkspaceState } from '@pestras/frontend/state';
import { Role } from '@pestras/shared/data-model';

@Component({
  selector: 'app-workspace',
  template: `
    <ng-container
      *ngIf="workspace$ | async as ws"
    >
      <app-pins [ws]="ws"></app-pins>
      <div class="sec-2">
        <workspace-stats *ngIf="[roles.ADMIN, roles.DATA_ENG] | hasRoles">
        </workspace-stats>
        <app-slides [ws]="ws"></app-slides>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: auto 1fr;
        height: var(--main-height);
      }

      .sec-2 {
        height: 100%;
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
