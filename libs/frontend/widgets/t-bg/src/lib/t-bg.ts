/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 't-bg-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="absolute inset-0 pointer-events-none ng-tns-c430-195"><g fill="none" stroke="currentColor" stroke-width="100" class="svg-1 text-gray-700 opacity-25 ng-tns-c430-195"><circle r="234" cx="196" cy="23" class="ng-tns-c430-195"></circle><circle r="234" cx="790" cy="491" class="ng-tns-c430-195"></circle></g></svg>
    <svg *ngIf="full" viewBox="0 0 220 192" width="220" height="192" fill="none" class="absolute svg-2 -top-16 -right-16 text-gray-700 ng-tns-c430-195"><defs class="ng-tns-c430-195"><pattern id="837c3e70-6c3a-44e6-8854-cc48c737b659" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" class="ng-tns-c430-195"><rect x="0" y="0" width="4" height="4" fill="currentColor" class="ng-tns-c430-195"></rect></pattern></defs><rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" class="ng-tns-c430-195"></rect></svg>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      inset: 0;
      background-color: var(--surface2);
      z-index: -1;
    }

    svg {
      position:  absolute;
      color: rgb(51 65 85 / 1);
    }

    .svg-1 {
      opacity: 0.5;
    }

    .svg-2 {
      inset-inline-end: 0px;
    }
  `]
})
export class TBgWidget {

  @Input()
  full = false;
}
