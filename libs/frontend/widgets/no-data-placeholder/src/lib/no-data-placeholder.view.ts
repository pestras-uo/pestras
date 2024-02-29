/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  booleanAttribute,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'no-data-placeholder-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img [class.small]="small" src="/assets/imgs/no-data.png" alt="" />
    <p class="mb-4 bold text3 f7">
      <ng-content></ng-content>
    </p>
    <button
      *ngIf="actionName && showAction"
      class="btn-primary btn-round"
      (click)="action.emit()"
    >
      {{ actionName }}
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 40px 28px;
        text-align: center;
/* 
        .color-scheme-dark &,
        &.color-scheme-dark {
          background-color: var(--surface3);
          border-radius: 2px;
        } */
      }

      img {
        width: 80%;
        max-width: 100px;
        margin: 0 auto;

        &.small {
          max-width: 64px;
        }

        .color-scheme-dark &,
        &.color-scheme-dark {
          filter: brightness(1) invert(1);
        }
      }
    `,
  ],
})
export class NoDataPlaceholderWidget {
  @Input()
  actionName?: string;
  @Input()
  showAction = true;
  @Input({ transform: booleanAttribute })
  small = false;

  @Output()
  action = new EventEmitter();
}
