/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, HostBinding, HostListener, Input, Output, booleanAttribute } from '@angular/core';

@Component({
  selector: 'pui-table-th',
  template: `
    <ng-content></ng-content>
    <i *ngIf="state" [puiIcon]="state === 1 ? 'north' : 'south'" size="tiny"></i>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between
    }
  `],
})
export class PuiTableTh {

  state: -1 | 0 | 1 = 0;

  @Input()
  key?: string;
  @Input({ transform: booleanAttribute })
  sortable = false;

  @HostListener('click')
  emit() {
    if (!this.sortable || !this.key)
      return;

    this.state = this.state === 0
      ? 1
      : this.state === 1
        ? -1
        : 0;

    this.sort.emit({ [this.key]: this.state });
  }

  @HostBinding('class')
  get hostCLass() {
    return this.sortable ? 'cursor-pointer primary' : '';
  }

  @Output()
  sort = new EventEmitter<Record<string, -1 | 0 | 1>>();
}
