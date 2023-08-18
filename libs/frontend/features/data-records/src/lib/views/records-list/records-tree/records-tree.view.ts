/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnChanges } from '@angular/core';
import { DataRecord, DataStore } from '@pestras/shared/data-model';
import { RecordsState } from '@pestras/frontend/state';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-records-tree-view',
  template: `
    <tree-view-widget
      *ngIf="records$ | async as rs"
      [data]="rs"
      [dataStore]="dataStore"
      [levels]="dataStore.settings.tree_view!"
      [baseUrl]="baseUrl"
    >     
    </tree-view-widget>
  `
})
export class TreeViewView implements OnChanges {

  baseUrl!: string;
  records$!: Observable<DataRecord[]>;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  topic?: string;
  @Input()
  search: any;

  constructor(
    private state: RecordsState
  ) { }

  ngOnChanges() {
    this.baseUrl = this.topic
      ? `/main/records/${this.topic}/${this.dataStore.serial}`
      : `/main/records/${this.dataStore.serial}`;

    this.records$ = this.state.search(this.dataStore.serial, {
      limit: 0,
      skip: 0,
      select: null,
      sort: { serial: 1 },
      search: this.search,
    })
      .pipe(map((data) => data.results));
  }
}
