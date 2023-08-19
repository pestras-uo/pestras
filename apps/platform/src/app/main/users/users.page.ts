/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  template: `
    <app-users-list [selected]="selected" (selects)="selected = $event"></app-users-list>

    <app-user-details [serial]="selected"></app-user-details>
  `,
  styles: [`
    :host {
      display: grid;
      grid-template-columns: auto 1fr;
      height: var(--main-height);
    }
  `]
})
export class UsersPage {
  selected = '';
}
