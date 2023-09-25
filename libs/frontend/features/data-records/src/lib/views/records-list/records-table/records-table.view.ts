/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { DataRecord, DataRecordState, DataStore, Field, TypeKind, TypesNames } from '@pestras/shared/data-model';
import { RecordsService } from '@pestras/frontend/state';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-records-table-view',
  templateUrl: './records-table.view.html'
})
export class RecordsTableView implements OnInit {

  readonly page$ = new BehaviorSubject<number>(1);
  readonly search$ = new BehaviorSubject<any>(null);
  readonly sort$ = new BehaviorSubject<Record<string, -1 | 0 | 1>>({});
  readonly pageSize = 15;
  readonly columns$ = new BehaviorSubject<Record<string, 0 | 1> | null>(null)

  count = 0;
  skip = 0;
  records$!: Observable<DataRecord[]>;
  fields!: Field[];
  preloader = false;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  rState: DataRecordState | "" = "";
  @Input()
  topic?: string;
  @Input()
  set search(input: any) {
    this.search$.next(input);
  }
  @Input({ required: true })
  set columns(value: string[]) {
    this.columns$.next(value.reduce((all, c) => (Object.assign(all, { [c]: 1 })), {} as Record<string, 0 | 1>));
  }

  constructor(
    private service: RecordsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fields = this.dataStore.fields.filter(f => {
      return !['unknown', 'image', 'file'].includes(f.type) && f.kind !== TypeKind.RICH_TEXT && f.name !== 'serial';
    });


    this.records$ = combineLatest([
      this.search$,
      this.page$.pipe(distinctUntilChanged()),
      this.sort$,
      this.columns$
    ])
      .pipe(
        tap(() => this.preloader = true),
        switchMap(([search, page, sort, select]) => {
          this.skip = (page - 1) * this.pageSize;

          const src = this.rState && this.rState !== DataRecordState.PUBLISHED ? `${this.rState}_${this.dataStore.serial}` : this.dataStore.serial;
          
          return this.service.search({ ds: src }, {
            limit: this.pageSize,
            skip: this.skip ?? 0,
            select: Object.assign({ serial: 1 }, select),
            sort: { ...sort, serial: -1 },
            search
          })
        }),
        map(res => {
          this.count = res.count;
          this.preloader = false;
          return res.results;
        })
      );
  }

  filterFields = (field: Field, columns: Record<string, number>) => {
    return Object.keys(columns).includes(field.name)
  }

  onSort(e: Record<string, -1 | 0 | 1>) {
    const all = Object.assign({}, this.sort$.getValue(), e);
    const sort: Record<string, -1 | 0 | 1> = {};

    for (const key in all)
      if (all[key] !== 0)
        sort[key] = all[key];

    this.sort$.next(sort);
  }

  findField(field: Field, name: string) {
    return field.name === name;
  }

  tryVisit(record: DataRecord) {
    this.router.navigate([
      '/main/records',
      this.topic ?? '',
      this.dataStore.serial,
      record['serial'],
    ], {
      queryParams: { state: this.rState }
    });
  }

  sortable(type: TypesNames) {
    return ['int', 'double', 'string', 'date', 'datetime'].includes(type);
  }
}
