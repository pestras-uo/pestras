/* eslint-disable @angular-eslint/component-class-suffix */
import { Component } from '@angular/core';
import { Role } from '@pestras/shared/data-model';

@Component({
  selector: 'pestras-main',
  template: `
    <main-drawer class="bg-surface1 hide-scroll color-scheme-dark"></main-drawer>
    <main>
      <main-header class="color-scheme-dark"></main-header>
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



  
}
