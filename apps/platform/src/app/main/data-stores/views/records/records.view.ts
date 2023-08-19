/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';
import { DataStore, DataStoreState, DataStoreType } from '@pestras/shared/data-model';

@Component({
  selector: 'app-records',
  template: `
    <app-records-list
      [editable]="editable"
      [dataStore]="dataStore"
    ></app-records-list>
  `,
})
export class RecordsView {
  readonly dsState = DataStoreState;
  readonly dsType = DataStoreType;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  editable = false;
}
