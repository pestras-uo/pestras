/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  booleanAttribute,
} from '@angular/core';
import {
  BaseDataViz,
  DataRecord,
  DataStore,
  DataVizTypes,
  TypedEntity,
  aggrRecords,
  createField,
} from '@pestras/shared/data-model';
import {
  DataVizState,
  DataStoresState,
  RegionsState,
  RecordsService,
} from '@pestras/frontend/state';
import { Observable, filter, map, tap } from 'rxjs';
import { ChartDataLoad } from '../../util';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.view.html',
  styles: [':host { display: block; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartView implements OnChanges {
  options$!: Observable<BaseDataViz | null>;
  data$!: Observable<ChartDataLoad>;

  @Input({ required: true })
  serial!: string;
  @Input({ transform: booleanAttribute })
  dark = false;

  @Input({ required: true })
  data_store!: DataStore;

  @Input({ required: true })
  records!: DataRecord[];

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

    this.data$ = this.options$.pipe(
      filter(Boolean),
      tap((opt) =>
        setTimeout(() => (this.ltr = opt.type !== DataVizTypes.TABLE))
      ),
      map((options) => {
        const { data: records, fields } = aggrRecords(
          this.data_store.fields,
          this.records,
          options.aggregate
        );

        return [fields, records, options] as [TypedEntity[], DataRecord[], BaseDataViz<any>];
      }),
      map((data) => {
        if (data[2].type === DataVizTypes.GIS)
          return [data[0], data[1]];

        const regionFields = data[0].filter((f) => f.type === 'region');

        if (regionFields.length)
          for (const r of data[1])
            for (const field of regionFields)
              r[field.name] = this.regionsState.get(
                r[field.name] as string
              )?.name;

        return [data[0], data[1]];
      }),
      map((data) => ({
        fields: data[0].map((t) => createField(t)),
        records: data[1],
      }))
    );
  }
}
