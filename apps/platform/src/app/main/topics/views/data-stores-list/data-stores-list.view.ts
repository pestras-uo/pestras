/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataStoresState } from '@pestras/frontend/state';
import { DataStoreType } from '@pestras/shared/data-model';

@Component({
  selector: 'app-data-stores-list-menu',
  templateUrl: './data-stores-list.view.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DataStoresListView {
  types = DataStoreType;

  @Input({ required: true })
  blueprint!: string;

  @Output()
  selects = new EventEmitter<string>();

  constructor(private state: DataStoresState) { }
}
