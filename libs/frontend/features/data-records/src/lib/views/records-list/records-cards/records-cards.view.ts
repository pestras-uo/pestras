/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DataRecordState, DataStore, TableDataRecord } from '@pestras/shared/data-model';
import { PubSubService } from '@pestras/frontend/ui';
import { RecordsService } from '@pestras/frontend/state';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-records-cards-view',
    styleUrls: ['./records-cards.view.scss'],
  template: `
    <ng-container *contra="let c">
      <!-- TODO: change cols-3 to auto fit grid columns -->
      <div
        class="record-card-content"
        *ngIf="records.results.length; else noData"
      >
        <app-record-card
          *ngFor="let record of records.results"
          [topic]="topic"
          [ds]="dataStore"
          [record]="record"
          [state]="rState"
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
  rState: DataRecordState | "" = "";
  @Input()
  topic?: string;
  @Input()
  search: any;

  constructor(
    private service: RecordsService,
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
    if (!this.init && this.records.count <= this.records.results.length)
      return;

    this.skip = this.records.results.length;

    const src = this.rState && this.rState !== 'published' ? `${this.rState}_${this.dataStore.serial}` : this.dataStore.serial;

    this.service.search(
      { ds: src },
      {
        limit: 20,
        skip: this.skip,
        sort: { serial: -1 },
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
