/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { DataStoresState } from '@pestras/frontend/state';
import { DataRecord, DataStore, DataStoreType } from '@pestras/shared/data-model';
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
  options!: string;
  @Input({ required: true })
  record!: DataRecord;

  constructor(private dsState: DataStoresState) {}

  ngOnChanges() {
    const sub = this.dataStore.settings.sub_data_stores[+this.options]
    this.search = { [sub.on.foreign_field]: this.record[sub.on.local_field] };

    this.subDataStore$ = this.dsState.select(sub.data_store);
  }
}
