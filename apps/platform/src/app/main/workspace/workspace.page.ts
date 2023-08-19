/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { WorkspaceState } from '@pestras/frontend/state';

@Component({
  selector: 'app-workspace',
  template: `
    <ng-container *ngIf="workspace$ | async as ws">
      <app-slides [ws]="ws"></app-slides>
      <app-pins [ws]="ws"></app-pins>
    </ng-container>
  `,
  styles: [`
    :host {
      display: grid;
      grid-template-columns: 1fr auto;
      height: var(--main-height);
      padding: 32px;
    }
  `]
})
export class WorkspacePage {
  readonly workspace$ = this.state.select();

  constructor(private state: WorkspaceState) {}
}
