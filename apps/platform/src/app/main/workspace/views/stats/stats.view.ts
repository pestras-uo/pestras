/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component } from '@angular/core';

@Component({
  selector: 'workspace-stats',
  templateUrl: './stats.view.html',
  styles: [`
    :host {
      display: flex;
      gap: 32px;
      padding: 32px 32px 0;
    }

    .stats-icon {
      height: 200px;
      width: 200px;
      opacity: 0.2;
      position: absolute;
      z-index: 0;
      inset-inline-end: -32px;
      inset-block-start: -32px;
    }
    .stats-value {
      line-height: 0.75;
      font-family: Arial;
      font-weight: bold
    }
  `],
})
export class StatsView {
}
