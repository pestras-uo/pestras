/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { DataStoresState } from '@pestras/frontend/state';
import { DataRecord, DataStore, DataStoreType, SubDataStores } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sub-data-stores-records',
  templateUrl: './sub-data-stores-records.view.html',
  styles: [
  ]
})
export class SubDataStoresRecordsView implements OnChanges {
  readonly dsTypes = DataStoreType;

  search!: any;

  subDataStore$!: Observable<DataStore | null>;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  options!: SubDataStores;
  @Input({ required: true })
  record!: DataRecord;

  constructor(private dsState: DataStoresState) {}

  ngOnChanges() {
    this.search = { [this.options.on.foreign_field]: this.record[this.options.on.local_field] };

    this.subDataStore$ = this.dsState.select(this.options.data_store);
  }
}
