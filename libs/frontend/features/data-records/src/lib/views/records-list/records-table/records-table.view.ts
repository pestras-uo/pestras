/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DataRecord, DataStore, Field, TypeKind } from '@pestras/shared/data-model';
import { RegionsState, RecordsState, CategoriesState } from '@pestras/frontend/state';
import { PuiTableColumnType, PuiTableConfig } from '@pestras/frontend/ui';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-records-table-view',
  template: `
    <pui-table
      *contra="let c"
      [config]="config"
      [list]="records$ | async"
      (rowClick)="tryVisit($event)"
      [searchPlaceholder]="c['search']"
      [templates]="{ serial: serialTmp }"
    >
      <no-data-placeholder-widget [small]="true">{{c['noDataMsg']}}</no-data-placeholder-widget>
    </pui-table>

    <ng-template #serialTmp let-key = key; let-item = item>
      <app-field-value 
        *ngIf="dataStore.fields | arrayFind: findField: key as field" [field]="field" 
        [value]="item[key]"
      ></app-field-value>
    </ng-template>
  `
})
export class RecordsTableView implements OnInit, OnChanges {
  config: PuiTableConfig = {
    columns: [],
    indexing: true,
    pagination: 20,
    search: true,
    sort: []
  };

  records$!: Observable<DataRecord[]>;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  topic?: string;
  @Input()
  search: any;

  constructor(
    private state: RecordsState,
    private regions: RegionsState,
    private catsState: CategoriesState,
    private router: Router
  ) { }

  ngOnChanges(): void {
    this.records$ = this.state.search(this.dataStore.serial, {
      limit: 0,
      skip: 0,
      select: null,
      sort: { serial: 1 },
      search: this.search,
    })
      .pipe(map((data) => data.results));
  }

  ngOnInit(): void {
    // string fields
    const stringFields = this.dataStore.fields.filter(
      (f) =>
        (f.type === 'string' || f.type === 'category') &&
        f.kind === TypeKind.NONE
    );

    for (const f of stringFields) {
      this.config.sort?.push(f.name);
      this.config.columns.push({
        key: f.name,
        header: f.display_name,
        searchable: true,
      });
    }

    // serial fields
    const serialFields = this.dataStore.fields.filter(
      f => f.type === 'serial' && f.ref_type !== null
    );

    for (const f of serialFields)
      this.config.columns.push({
        key: f.name,
        header: f.display_name,
        type: PuiTableColumnType.TEMPLATE,
        template: 'serial'
      });

    // region fields
    const regionFields = this.dataStore.fields.filter(
      (f) => f.type === 'region'
    );

    for (const f of regionFields)
      this.config.columns.push({
        key: f.name,
        header: f.display_name,
        searchable: true,
        srcKeyValueArray: this.regions.data.map((r) => ({
          key: r.name,
          value: r.serial,
        })),
      });

    // ordinal fields
    const ordinalFields = this.dataStore.fields.filter(
      (f) => f.type === 'category' && f.kind === TypeKind.ORDINAL
    );

    for (const f of ordinalFields) {
      this.config.columns.push({
        key: f.name,
        header: f.display_name,
        searchable: true,
        formatter: (key, _, row) =>
          this.catsState.get(row[key])?.title ?? null,
      });
    }


    // numirc fields
    const numericFields = this.dataStore.fields.filter((f) =>
      ['number', 'int', 'double'].includes(f.type)
    );

    for (const f of numericFields) {
      this.config.sort?.push(f.name);
      this.config.columns.push({
        key: f.name,
        header: f.display_name,
        type: PuiTableColumnType.NUMBER,
      });
    }

    // date fields
    const dateFields = this.dataStore.fields.filter((f) =>
      ['date', 'datetime'].includes(f.type)
    );

    for (const f of dateFields) {
      this.config.sort?.push(f.name);
      this.config.columns.push({
        key: f.name,
        header: f.display_name,
        type: PuiTableColumnType.DATE,
      });
    }


    // boolean fields
    const boolFields = this.dataStore.fields.filter(
      (f) => f.type === 'boolean'
    );

    for (const f of boolFields)
      this.config.columns.push({
        key: f.name,
        header: f.display_name,
        type: PuiTableColumnType.BOOL,
      });


    // location field
    const locFields = this.dataStore.fields.filter(
      (f) => f.type === 'location'
    );

    for (const f of locFields)
      this.config.columns.push({
        key: f.name,
        header: f.display_name,
        type: PuiTableColumnType.LOCATION,
      });
  }

  findField(field: Field, name: string) {
    return field.name === name;
  }

  tryVisit(record: DataRecord) {
    if (!this.topic) return;

    this.router.navigate([
      '/main/records',
      this.topic,
      this.dataStore.serial,
      record['serial'],
    ]);
  }
}
