/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';

@Component({
  selector: 'app-regions',
  template: `
    <app-regions-list [selected]="selected" (selects)="selected = $event"></app-regions-list>
    <app-region-details [serial]="selected"></app-region-details>
  `,
  styles: [`
    :host {
      display: grid;
      grid-template-columns: auto 1fr;
      height: var(--main-height);
    }
  `]
})
export class RegionsPage {
  selected = ''
}
