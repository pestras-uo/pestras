/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { DataRecord, DataStore, Field, TypeKind } from '@pestras/shared/data-model';
import { RecordsState } from '@pestras/frontend/state';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-records-table-view',
  templateUrl: './records-table.view.html'
})
export class RecordsTableView implements OnInit {

  readonly page$ = new BehaviorSubject<number>(1);
  readonly search$ = new BehaviorSubject<any>(null);
  readonly pageSize = 15;

  count = 0;
  skip = 0;
  records$!: Observable<DataRecord[]>;
  fields!: Field[];

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  topic?: string;
  @Input()
  set search(input: any) {
    this.search$.next(input);
  }

  constructor(
    private state: RecordsState,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fields = this.dataStore.fields.filter(f => {
      return !['unknown', 'image', 'file'].includes(f.type) && f.kind !== TypeKind.RICH_TEXT;
    });


    this.records$ = combineLatest([
      this.search$,
      this.page$.pipe(distinctUntilChanged())
    ])
      .pipe(
        switchMap(([search, page]) => {
          this.skip = (page - 1) * this.pageSize;

          return this.state.search(this.dataStore.serial, {
            limit: this.pageSize,
            skip: this.skip ?? 0,
            select: null,
            sort: { serial: 1 },
            search
          })
        }),
        map(res => {
          this.count = res.count;
          return res.results;
        })
      );
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
    ]);
  }
}
