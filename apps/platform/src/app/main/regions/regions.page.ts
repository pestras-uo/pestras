/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-regions',
  template: `
    <app-regions-list
      [selected]="selected"
      (selects)="set($event)"
    ></app-regions-list>
    <app-region-details [serial]="selected"></app-region-details>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: auto 1fr;
        height: var(--main-height);
      }
    `,
  ],
})
export class RegionsPage {
  selected = '';

  @Input()
  set region(value: string) {
    this.selected = value ?? '';
  }

  constructor(private router: Router, private route: ActivatedRoute) {}

  set(serial: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { region: serial },
    });
  }
}
