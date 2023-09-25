/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnChanges } from '@angular/core';
import { DataRecord, DataRecordState, DataStore } from '@pestras/shared/data-model';
import { RecordsService } from '@pestras/frontend/state';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-records-tree-view',
  template: `
    <tree-view-widget
      *ngIf="records$ | async as rs"
      [data]="rs"
      [dataStore]="dataStore"
      [levels]="dataStore.settings.tree_view!"
      (clicked)="tryVisit($event)"
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
  rState: DataRecordState | "" = "";
  @Input()
  topic?: string;
  @Input()
  search: any;

  constructor(
    private service: RecordsService,
    private router: Router
  ) { }

  ngOnChanges() {
    this.baseUrl = this.topic
      ? `/main/records/${this.topic}/${this.dataStore.serial}`
      : `/main/records/${this.dataStore.serial}`;

    const src = this.rState && this.rState !== DataRecordState.PUBLISHED ? `${this.rState}_${this.dataStore.serial}` : this.dataStore.serial;

    this.records$ = this.service.search({ ds: src }, {
      limit: 0,
      skip: 0,
      select: null,
      sort: { serial: 1 },
      search: this.search,
    })
      .pipe(map((data) => data.results));
  }

  tryVisit(serial: string) {
    this.router.navigate(
      this.topic
        ? ['/main/records', this.topic, this.dataStore.serial, serial]
        : ['/main/records', this.dataStore.serial, serial],
      {
        queryParams: { state: this.rState }
      }
    )
  }
}
