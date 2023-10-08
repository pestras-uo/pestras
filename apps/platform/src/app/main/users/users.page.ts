/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  template: `
    <app-users-list [selected]="selected" (selects)="set($event)"></app-users-list>

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

  @Input()
  set user(value: string) {
    this.selected = value ?? ''
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  set(serial: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { user: serial } })
  }
}
