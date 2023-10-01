/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnChanges } from '@angular/core';
import { DataRecord, DataRecordState, DataStore, DataStoreTreeViewItemConfig } from '@pestras/shared/data-model';
import { RecordsService } from '@pestras/frontend/state';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-records-tree-view',
  template: `
    <tree-view-widget
      *ngIf="levels"
      [dataStore]="dataStore"
      [levels]="levels"
      [loadCategory]="loadCategory"
      [loadData]="loadData"
      [level]="0"
      [filter]="{}"
      [clickHandler]="click"
    >     
    </tree-view-widget>
  `
})
export class TreeViewView implements OnChanges {

  baseUrl!: string;
  records$!: Observable<DataRecord[]>;
  levels!: DataStoreTreeViewItemConfig[] | null;

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

  ngOnChanges(): void {
    this.levels = this.dataStore.settings.tree_view;
    this.baseUrl = this.topic
      ? `/main/records/${this.topic}/${this.dataStore.serial}`
      : `/main/records/${this.dataStore.serial}`;
  }

  loadCategory = (category: string, parents: Record<string, string>) => {
    const src = this.rState && this.rState !== DataRecordState.PUBLISHED ? `${this.rState}_${this.dataStore.serial}` : this.dataStore.serial;
    return this.service.getCategoryValues({ ds: src }, { field: category, search: parents });
  }

  loadData = (parents: Record<string, string>): Observable<Record<string, any>[]> => {
    const src = this.rState && this.rState !== DataRecordState.PUBLISHED ? `${this.rState}_${this.dataStore.serial}` : this.dataStore.serial;
    return this.service.search({ ds: src }, {
      limit: 0,
      skip: 0,
      select: null,
      sort: { serial: 1 },
      search: parents,
    }).pipe(map((data) => data.results));
  }

  click = (record: DataRecord) => {
    if (record['serial'])
      this.router.navigate([this.baseUrl, record['serial']])
  }
}