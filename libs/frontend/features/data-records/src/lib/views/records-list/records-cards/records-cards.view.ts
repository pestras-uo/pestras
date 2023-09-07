/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DataStore, TableDataRecord } from '@pestras/shared/data-model';
import { PubSubService } from '@pestras/frontend/ui';
import { RecordsState } from '@pestras/frontend/state';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-records-cards-view',
  template: `
    <ng-container *contra="let c">
      <div
        class="grid cols-3 gap-8"
        *ngIf="records.results.length; else noData"
      >
        <app-record-card
          *ngFor="let record of records.results"
          [topic]="topic"
          [ds]="dataStore"
          [record]="record"
        >
        </app-record-card>
      </div>

      <ng-template #noData>
        <no-data-placeholder-widget>{{ c['noDataMsg'] }}</no-data-placeholder-widget>
      </ng-template>
    </ng-container>
  `,
})
export class RecordsCardView implements OnChanges, OnInit {
  private ud = untilDestroyed();

  records!: { count: number; results: TableDataRecord[] };
  skip!: number;
  init!: boolean;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  topic?: string;
  @Input()
  search: any;

  constructor(
    private state: RecordsState,
    private pubSub: PubSubService
  ) { }

  ngOnChanges(): void {
    this.skip = 0;
    this.records = { count: 0, results: [] };
    this.init = true;
    this.load();

    this.init = false;
  }

  ngOnInit(): void {
    this.pubSub
      .sub('recordsList')
      .pipe(this.ud())
      .subscribe(() => this.load());
  }

  load() {
    if (!this.init && this.records.count <= this.records.results.length) return;

    this.skip = this.records.results.length;

    this.state.query(
      this.dataStore.serial,
      {
        limit: 20,
        skip: this.skip,
        sort: { serial: 1 },
        select: null,
        search: this.search,
      }
    )
      .subscribe((data) => {
        if (this.skip > 0) {
          this.records.count = data.count;
          this.records.results = this.records.results.concat(
            data.results as TableDataRecord[]
          );
        } else this.records = data;
      });
  }

  trackby(_: number, record: any) {
    return record.serial;
  }
}
