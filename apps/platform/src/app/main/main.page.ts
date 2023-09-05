/* eslint-disable @angular-eslint/component-class-suffix */
import { Component } from '@angular/core';
import { Role } from '@pestras/shared/data-model';

@Component({
  selector: 'pestras-main',
  template: `
    <main-drawer
      [full]="openDrawer"
      [class.open]="openDrawer" 
      [class.close]="!openDrawer" 
      (toggle)="openDrawer = !openDrawer">
    </main-drawer>
    <main (click)="closeDrawer()">
      <main-header></main-header>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      height: 100vh;
      
      > main {
        position: relative;
        padding-inline-start: 72px;
        z-index: 1;
        display: grid;
        grid-template-rows: var(--header-height) 1fr;
      }
    }

    main-header {
      position: relative;
      z-index: 2;
    }

    main-drawer {
      position: fixed;
      z-index: 100;
      inset-inline-start: 0;
    }
  `]
})
export class MainPage {
  readonly roles = Role;

  openDrawer = false;

  closeDrawer() {
    this.openDrawer = false;
    return true;
  }
}
