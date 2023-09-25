/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges } from '@angular/core';
import { BaseDataViz, DataRecord, DataVizTypes, TypedEntity, aggrRecords, createField } from '@pestras/shared/data-model';
import { DataVizState, DataStoresState, RegionsState, RecordsService } from '@pestras/frontend/state';
import { Observable, switchMap, forkJoin, filter, take, map, tap } from 'rxjs';
import { ChartDataLoad } from '../../util';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.view.html',
  styles: [':host { display: block; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartView implements OnChanges {

  options$!: Observable<BaseDataViz | null>;
  data$!: Observable<ChartDataLoad>;

  @Input({ required: true })
  serial!: string;

  @HostBinding('class.ltr')
  ltr = false;

  constructor(
    private state: DataVizState,
    private dsState: DataStoresState,
    private regionsState: RegionsState,
    private recordsService: RecordsService
  ) { }

  ngOnChanges(): void {
    this.options$ = this.state.select(this.serial);

    this.data$ = this.options$
      .pipe(
        filter(Boolean),
        tap(opt => setTimeout(() => this.ltr = opt.type !== DataVizTypes.TABLE)),
        switchMap(options => {
          return forkJoin([
            this.dsState.select(options.data_store).pipe(filter(Boolean), take(1)),
            this.recordsService.search({ ds: options.data_store }, { limit: 0 })
              .pipe(
                filter(Boolean),
                map(res => res.results),
                take(1)
              )
          ]).pipe(
            map(data => {
              const { data: records, fields } = aggrRecords(data[0].fields, data[1], options.aggregate);
              
              return [fields, records] as [TypedEntity[], DataRecord[]];
            }),
            map(data => {
              const regionFields = data[0].filter(f => f.type === 'region');

              if (regionFields.length)
                for (const r of data[1])
                  for (const field of regionFields)
                    r[field.name] = this.regionsState.get(r[field.name] as string)?.name;

              return data;
            }),
            map(data => ({ fields: data[0].map(t => createField(t)), records: data[1] })),
          )
        })
      );
  }
}


